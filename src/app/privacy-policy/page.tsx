import type { Metadata } from "next";
import { GlobalContact, GlobalFooter, GlobalHeader } from "../components/global-sections";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How New Direction handles personal data collected through the NWD Agency website."
};

export default function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <GlobalHeader />

      <article className="legal-content shell">
        <header className="legal-hero">
          <p className="kicker">Legal</p>
          <h1>Privacy Policy</h1>
          <div className="legal-intro">
            <p>
              New Direction d.o.o. (“NWD”, “we”, “us” or “our”) respects your privacy and is
              committed to handling personal data responsibly and transparently.
            </p>
            <p>
              This Privacy Policy explains what information we collect through nwdagency.com (the
              “Website”), why we collect it, how we use it, and the rights available to you.
            </p>
          </div>
        </header>

        <div className="legal-sections">
          <section>
            <h2>1. Who we are</h2>
            <p>The Website is operated by:</p>
            <p className="legal-details">
              New Direction d.o.o. Beograd
              <br />
              Short business name: New Direction d.o.o.
              <br />
              Legal form: Limited Liability Company
              <br />
              Registered office: Đorđa Čutukovića 28B, Floor 2, Apartment 7, 11080 Zemun,
              Belgrade, Serbia
              <br />
              Company Registration Number: 21932108
              <br />
              Tax Identification Number (PIB): 113831497
              <br />
              Primary business activity: 7311 – Advertising Agencies
              <br />
              Email: office@nwdagency.com
              <br />
              Website: nwdagency.com
            </p>
            <p>
              For the purposes of applicable personal data protection law, New Direction d.o.o. acts
              as the data controller for personal data collected through the Website.
            </p>
          </section>

          <section>
            <h2>2. Information we collect</h2>
            <p>
              We may collect personal data that you choose to provide when contacting us through the
              Website.
            </p>
            <p>This may include:</p>
            <ul>
              <li>first and last name;</li>
              <li>email address;</li>
              <li>company or brand name;</li>
              <li>information contained in your message or project enquiry;</li>
              <li>any other information you voluntarily provide to us.</li>
            </ul>
            <p>
              Please avoid including sensitive personal information in your enquiry unless it is
              necessary for the purpose of your communication.
            </p>
            <p>
              Our hosting and technical infrastructure may also process limited technical
              information necessary to deliver, maintain and secure the Website, such as IP address,
              browser information or server log data.
            </p>
          </section>

          <section>
            <h2>3. How we use your information</h2>
            <p>
              We process personal data only where there is an appropriate legal basis and for
              purposes connected with our business.
            </p>
            <p>This may include:</p>
            <ul>
              <li>responding to enquiries submitted through the Website;</li>
              <li>discussing potential projects or collaborations;</li>
              <li>taking steps requested by you before entering into a business relationship;</li>
              <li>maintaining relevant business correspondence;</li>
              <li>protecting the security and integrity of the Website;</li>
              <li>complying with applicable legal and regulatory obligations.</li>
            </ul>
            <p>Submitting an enquiry does not subscribe you to marketing communications.</p>
          </section>

          <section>
            <h2>4. Cookies and tracking technologies</h2>
            <p>
              At the date of this Privacy Policy, NWD does not intentionally use non-essential
              cookies or tracking technologies for advertising, profiling, behavioural analytics or
              remarketing through the Website.
            </p>
            <p>
              The Website or its hosting infrastructure may use technical mechanisms strictly
              necessary for the operation, security or delivery of the Website.
            </p>
            <p>
              If we introduce analytics, advertising or other non-essential tracking technologies in
              the future, we will update this Privacy Policy and, where required, provide an
              appropriate consent mechanism.
            </p>
          </section>

          <section>
            <h2>5. Sharing personal data</h2>
            <p>
              We do not disclose personal data collected through the Website except where this is
              reasonably necessary.
            </p>
            <p>
              Information may be processed by trusted service providers that support the operation
              of our Website, hosting, email or business systems, subject to appropriate
              confidentiality and data protection requirements.
            </p>
            <p>
              We may also disclose information where required by law, regulation, court order or a
              competent public authority.
            </p>
          </section>

          <section>
            <h2>6. International data transfers</h2>
            <p>
              Some technology or service providers used in operating the Website or our business
              systems may process data outside the Republic of Serbia.
            </p>
            <p>
              Where applicable, we take reasonable steps to ensure that such transfers are carried
              out in accordance with applicable data protection requirements and with appropriate
              safeguards.
            </p>
          </section>

          <section>
            <h2>7. How long we keep personal data</h2>
            <p>
              We retain personal data only for as long as reasonably necessary for the purpose for
              which it was collected.
            </p>
            <p>
              Business enquiries and related correspondence may be retained while the enquiry,
              potential engagement or subsequent business relationship remains relevant, and
              thereafter where necessary to meet legal obligations or establish, exercise or defend
              legal claims.
            </p>
          </section>

          <section>
            <h2>8. Data security</h2>
            <p>
              We take reasonable technical and organisational measures designed to protect personal
              data against unauthorised access, loss, alteration, disclosure or misuse.
            </p>
            <p>No website or electronic transmission can, however, be guaranteed to be completely secure.</p>
          </section>

          <section>
            <h2>9. Your rights</h2>
            <p>Subject to applicable law, you may have the right to:</p>
            <ul>
              <li>request access to your personal data;</li>
              <li>request correction of inaccurate or incomplete data;</li>
              <li>request deletion of your personal data;</li>
              <li>request restriction of processing;</li>
              <li>object to certain types of processing;</li>
              <li>request data portability where applicable;</li>
              <li>withdraw consent where processing is based on consent;</li>
              <li>lodge a complaint with the competent data protection authority.</li>
            </ul>
            <p>
              In Serbia, the competent supervisory authority is the Commissioner for Information of
              Public Importance and Personal Data Protection.
            </p>
            <p>To exercise your rights or ask a question about how we process personal data, contact:</p>
            <p>
              <a href="mailto:office@nwdagency.com">office@nwdagency.com</a>
            </p>
          </section>

          <section>
            <h2>10. Third-party websites</h2>
            <p>
              The Website may contain links to websites or digital services operated by third
              parties.
            </p>
            <p>
              We are not responsible for the privacy practices, security or content of third-party
              websites. We recommend reviewing their privacy information separately.
            </p>
          </section>

          <section>
            <h2>11. Changes to this Privacy Policy</h2>
            <p>
              We may update this Privacy Policy when our Website, services, technology or legal
              obligations change.
            </p>
            <p>
              The current version will always be published on this page together with its latest
              revision date.
            </p>
          </section>

          <section>
            <h2>12. Contact</h2>
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
