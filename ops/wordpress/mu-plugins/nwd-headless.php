<?php
/**
 * Plugin Name: NWD Headless
 * Description: WordPress as the CMS for nwdagency.com/blog. Redirects the front end to the Next.js site, adds the Intro paragraph style and the Credits field, and tells Next.js to refresh its cache when content changes.
 */

defined('ABSPATH') || exit;

const NWD_SITE_URL = 'https://nwdagency.com';

// The public site is nwdagency.com; this install only serves wp-admin, the REST API and uploads.
// Priority 0 runs before WordPress' own canonical redirect.
add_action('template_redirect', function () {
    if (is_preview()) {
        return;
    }

    $target = NWD_SITE_URL . '/blog';
    if (is_singular('post')) {
        $target .= '/' . get_post_field('post_name', get_queried_object_id());
    }

    wp_redirect($target, 301);
    exit;
}, 0);

add_filter('wp_sitemaps_enabled', '__return_false');
add_filter('xmlrpc_enabled', '__return_false');
add_filter('wp_is_application_passwords_available', '__return_false');

// Anonymous REST requests do not get the user list; the editor still does.
add_filter('rest_endpoints', function (array $endpoints): array {
    if (!is_user_logged_in()) {
        unset($endpoints['/wp/v2/users'], $endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

// No comments, no pages: the blog is posts only.
add_filter('comments_open', '__return_false', 20);
add_filter('pings_open', '__return_false', 20);
add_action('init', function () {
    remove_post_type_support('post', 'comments');
    remove_post_type_support('post', 'trackbacks');
});
add_action('admin_menu', function () {
    remove_menu_page('edit-comments.php');
    remove_menu_page('edit.php?post_type=page');
});

// Orange serif paragraph with a short rule above it (the intro block in the post design).
add_action('init', function () {
    register_block_style('core/paragraph', [
        'name' => 'intro',
        'label' => 'Intro',
        'inline_style' => '.is-style-intro{color:#ff4c1f;font-family:"Instrument Serif",Georgia,serif;font-size:1.33em;line-height:1.5}'
            . '.is-style-intro::before{content:"";display:block;width:46px;height:3px;margin-bottom:33px;background:#ff4c1f}',
    ]);
});

// The grey lead under the post title: only a hand-written excerpt, never the one WordPress
// generates from the content (that would repeat the first paragraph).
add_action('rest_api_init', function () {
    register_rest_field('post', 'nwd_lead', [
        'get_callback' => fn (array $post) => has_excerpt($post['id']) ? get_post_field('post_excerpt', $post['id']) : '',
        'schema' => ['type' => 'string', 'context' => ['view', 'edit'], 'readonly' => true],
    ]);
});

// Credits: one name per line, shown under the post as CREDITS.
add_action('init', function () {
    register_post_meta('post', 'nwd_credits', [
        'type' => 'string',
        'single' => true,
        'show_in_rest' => true,
        'sanitize_callback' => 'sanitize_textarea_field',
        'auth_callback' => fn () => current_user_can('edit_posts'),
    ]);
});

add_action('add_meta_boxes_post', function () {
    add_meta_box('nwd-credits', 'Credits', function (WP_Post $post) {
        wp_nonce_field('nwd_credits', 'nwd_credits_nonce');
        printf(
            '<textarea name="nwd_credits" rows="4" style="width:100%%" placeholder="One name per line">%s</textarea>',
            esc_textarea(get_post_meta($post->ID, 'nwd_credits', true))
        );
    }, null, 'side');
});

add_action('save_post_post', function (int $post_id) {
    $nonce = $_POST['nwd_credits_nonce'] ?? '';
    if (!$nonce || !wp_verify_nonce($nonce, 'nwd_credits') || !current_user_can('edit_post', $post_id)) {
        return;
    }
    update_post_meta($post_id, 'nwd_credits', sanitize_textarea_field(wp_unslash($_POST['nwd_credits'] ?? '')));
});

// Ask Next.js to refresh its cached blog data (and the changed posts' pages).
// Queued once per request and sent after the response.
function nwd_queue_revalidate(?string $slug = null): void
{
    static $slugs = null;
    if (!defined('NWD_REVALIDATE_URL') || !defined('NWD_REVALIDATE_SECRET')) {
        return;
    }

    if ($slugs === null) {
        $slugs = [];
        add_action('shutdown', function () use (&$slugs) {
            wp_remote_post(NWD_REVALIDATE_URL, [
                'blocking' => false,
                'timeout' => 2,
                'headers' => [
                    'Authorization' => 'Bearer ' . NWD_REVALIDATE_SECRET,
                    'Content-Type' => 'application/json',
                ],
                'body' => wp_json_encode(['slugs' => array_values(array_unique($slugs))]),
            ]);
        });
    }

    if ($slug) {
        $slugs[] = $slug;
    }
}

add_action('save_post_post', function (int $post_id, WP_Post $post) {
    if (wp_is_post_autosave($post_id) || wp_is_post_revision($post_id) || $post->post_status === 'auto-draft') {
        return;
    }
    // Trashing renames the slug to "<slug>__trashed"; the page to refresh is the original one.
    nwd_queue_revalidate(preg_replace('/__trashed$/', '', $post->post_name));
}, 20, 2);
add_action('edited_term', fn () => nwd_queue_revalidate());
add_action('edit_attachment', fn () => nwd_queue_revalidate());
