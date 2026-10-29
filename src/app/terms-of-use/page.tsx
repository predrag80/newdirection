import type { Metadata } from "next";
import Link from "next/link";
import { GlobalContact, GlobalFooter, GlobalHeader } from "../components/global-sections";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms governing access to and use of the NWD Agency website."
};

export default function TermsOfUsePage() {
  return (
    <main className="legal-page">
      <GlobalHeader />

      <article className="legal-content shell">
        <header className="legal-hero">
          <p className="kicker">Legal</p>
          <h1>Terms of Use</h1>
          <div className="legal-intro">
            <p>
              These Terms of Use govern access to and use of nwdagency.com (the “Website”),
              operated by New Direction d.o.o. Beograd (“NWD”, “we”, “us” or “our”).
            </p>
            <p>By accessing or using the Website, you agree to these Terms of Use.</p>
          </div>
        </header>

        <div className="legal-sections">
          <section>
            <h2>1. About this Website</h2>
            <p>
              The Website presents New Direction, our capabilities, strategic approach, selected
              work, perspectives and services.
            </p>
            <p>The content is provided for general informational and business communication purposes.</p>
          </section>

          <section>
            <h2>2. No client relationship</h2>
            <p>
              Nothing on this Website constitutes a binding offer, agreement or commitment by NWD
              to provide services.
            </p>
            <p>
              Submitting a contact form, sending an email or otherwise contacting NWD does not by
              itself establish a client, advisory or contractual relationship.
            </p>
            <p>
              Any project engagement, scope of work, deliverables, responsibilities, commercial
              terms and other conditions are agreed separately through an accepted proposal,
              statement of work, contract or other written agreement.
            </p>
            <p>Where such an agreement exists, its terms prevail in relation to the relevant engagement.</p>
          </section>

          <section>
            <h2>3. Intellectual property</h2>
            <p>
              Unless otherwise stated, the Website and its original content are owned by or licensed
              to New Direction d.o.o.
            </p>
            <p>This includes, without limitation:</p>
            <ul>
              <li>the New Direction name and visual identity;</li>
              <li>Website design and structure;</li>
              <li>written content and strategic narratives;</li>
              <li>proprietary methods and frameworks;</li>
              <li>strategy and decision-making systems;</li>
              <li>diagrams, models and presentations;</li>
              <li>original graphics, animations and visual systems;</li>
              <li>the Direction Lock System™ and related methodology;</li>
              <li>original case study presentation and editorial content.</li>
            </ul>
            <p>
              Access to the Website does not grant any licence or right to use NWD intellectual
              property except for ordinary personal or internal business viewing of the Website.
            </p>
          </section>

          <section>
            <h2>4. Permitted use</h2>
            <p>
              You may access, browse and share links to publicly available pages of the Website for
              lawful purposes.
            </p>
            <p>You may not, without prior written permission from NWD:</p>
            <ul>
              <li>reproduce or republish substantial parts of the Website;</li>
              <li>copy, adapt or commercially exploit our proprietary frameworks or methodologies;</li>
              <li>present NWD content or work as your own;</li>
              <li>remove copyright, trademark or other proprietary notices;</li>
              <li>use Website content to create misleading or unauthorised derivative commercial materials;</li>
              <li>use the Website in a way that interferes with its operation or security.</li>
            </ul>
          </section>

          <section>
            <h2>5. Client work and third-party rights</h2>
            <p>
              The Website may display projects, campaign materials, packaging, photographs,
              trademarks, product names and other materials created for or associated with NWD
              clients and collaborators.
            </p>
            <p>
              Client names, trademarks, logos, product names and other third-party intellectual
              property remain the property of their respective owners.
            </p>
            <p>Their appearance on this Website does not grant any right or licence to use them.</p>
          </section>

          <section>
            <h2>6. Case studies and results</h2>
            <p>
              Case studies, project descriptions, outcomes and metrics presented on the Website are
              intended to illustrate selected NWD work and experience.
            </p>
            <p>Past project results do not guarantee identical or similar outcomes for future projects.</p>
            <p>
              Every engagement is affected by its own market conditions, business context,
              implementation and other factors.
            </p>
          </section>

          <section>
            <h2>7. Accuracy and availability</h2>
            <p>
              We aim to keep the Website clear, accurate and current, but we do not guarantee that
              all information will always be complete, error-free or up to date.
            </p>
            <p>We may change, update, remove or reorganise Website content at any time.</p>
            <p>We do not guarantee uninterrupted or error-free availability of the Website.</p>
          </section>

          <section>
            <h2>8. Limitation of liability</h2>
            <p>
              To the extent permitted by applicable law, NWD will not be liable for loss or damage
              arising solely from reliance on general information published on the Website or from
              temporary inability to access the Website.
            </p>
            <p>
              Nothing in these Terms excludes or limits liability where such exclusion or limitation
              would not be permitted by applicable law.
            </p>
          </section>

          <section>
            <h2>9. External links</h2>
            <p>The Website may include links to third-party websites, platforms or services.</p>
            <p>
              Such links are provided for convenience or reference. NWD does not control and is not
              responsible for the content, security, availability, terms or privacy practices of
              third-party services.
            </p>
          </section>

          <section>
            <h2>10. Privacy</h2>
            <p>
              Personal data submitted through or processed in connection with the Website is
              handled in accordance with our <Link href="/privacy-policy">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2>11. Changes to these Terms</h2>
            <p>We may update these Terms of Use from time to time.</p>
            <p>
              The version published on this page, together with the stated revision date, is the
              current version.
            </p>
          </section>

          <section>
            <h2>12. Governing law</h2>
            <p>These Terms of Use are governed by the laws of the Republic of Serbia.</p>
            <p>
              Any dispute relating to the Website or these Terms will be subject to the jurisdiction
              of the competent courts in the Republic of Serbia, unless mandatory applicable law
              provides otherwise.
            </p>
          </section>

          <section>
            <h2>13. Legal information</h2>
            <p className="legal-details">
              Business name: New Direction d.o.o. Beograd
              <br />
              Short business name: New Direction d.o.o.
              <br />
              Legal form: Limited Liability Company
              <br />
              Company Registration Number: 21932108
              <br />
              Tax Identification Number (PIB): 113831497
              <br />
              Registered office: Đorđa Čutukovića 28B, Floor 2, Apartment 7, 11080 Zemun,
              Belgrade, Serbia
              <br />
              Primary business activity: 7311 – Advertising Agencies
              <br />
              Duration: Indefinite
              <br />
              Email: office@nwdagency.com
              <br />
              Website: nwdagency.com
            </p>
          </section>

          <section>
            <h2>14. Contact</h2>
            <p>For questions regarding these Terms of Use:</p>
            <p className="legal-details">
              New Direction d.o.o. Beograd
              <br />
              Đorđa Čutukovića 28B, Floor 2, Apartment 7
              <br />
              11080 Zemun, Belgrade, Serbia
              <br />
              <a href="mailto:office@nwdagency.com">office@nwdagency.com</a>
            </p>
          </section>
        </div>
      </article>

      <GlobalContact />
      <GlobalFooter />
    </main>
  );
}
