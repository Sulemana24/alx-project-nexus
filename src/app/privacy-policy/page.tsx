// app/privacy-policy/page.tsx
import { Card, CardContent } from "@/components/ui/Card";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-amber-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">Last updated: December 2024</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="prose prose-lg max-w-none text-gray-700">
              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  1. Information We Collect
                </h2>
                <p className="mb-4">
                  We collect information to provide better services to all our
                  users. The types of information we collect include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong>Account Information:</strong> When you create an
                    account, we collect your name, email address, and
                    institutional affiliation.
                  </li>
                  <li>
                    <strong>Educational Content:</strong> PDFs and other
                    materials you upload to generate quizzes.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> How you interact with our
                    platform, including quiz results and learning progress.
                  </li>
                  <li>
                    <strong>Technical Information:</strong> IP address, browser
                    type, and device information for security and analytics.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  2. How We Use Your Information
                </h2>
                <p className="mb-4">
                  We use the information we collect for the following purposes:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>To provide, maintain, and improve our services</li>
                  <li>
                    To generate personalized quizzes and learning materials
                  </li>
                  <li>To track and analyze learning progress and outcomes</li>
                  <li>
                    To communicate with you about service updates and
                    educational content
                  </li>
                  <li>To ensure platform security and prevent fraud</li>
                  <li>To comply with legal obligations</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  3. Data Security
                </h2>
                <p className="mb-4">
                  We implement appropriate technical and organizational security
                  measures to protect your personal information against
                  unauthorized access, alteration, disclosure, or destruction.
                  These measures include:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and updates</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Secure data storage with reputable cloud providers</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  4. Data Sharing and Disclosure
                </h2>
                <p className="mb-4">
                  We do not sell your personal information. We may share your
                  information in the following circumstances:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>
                    <strong>With Educational Institutions:</strong> If you are
                    using Learnify through your institution, we may share
                    progress data with authorized personnel.
                  </li>
                  <li>
                    <strong>Service Providers:</strong> With trusted partners
                    who help us operate our platform (e.g., hosting, analytics).
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law or
                    to protect our rights and users.
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In connection with a
                    merger, acquisition, or sale of assets.
                  </li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  5. Your Rights
                </h2>
                <p className="mb-4">You have the right to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Access and download your personal data</li>
                  <li>Correct inaccurate personal information</li>
                  <li>Request deletion of your personal data</li>
                  <li>Object to or restrict certain processing activities</li>
                  <li>Data portability</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  6. Children Privacy
                </h2>
                <p className="mb-4">
                  Learnify is designed for educational use by students of all
                  ages. For users under 13, we require parental consent and
                  comply with COPPA regulations. Educational institutions are
                  responsible for obtaining necessary consents for minor
                  students.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  7. International Data Transfers
                </h2>
                <p className="mb-4">
                  Your information may be transferred to and processed in
                  countries other than your own. We ensure appropriate
                  safeguards are in place to protect your data in accordance
                  with this privacy policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  8. Changes to This Policy
                </h2>
                <p className="mb-4">
                  We may update this privacy policy from time to time. We will
                  notify you of any changes by posting the new policy on this
                  page and updating the Last updated date.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  9. Contact Us
                </h2>
                <p className="mb-4">
                  If you have any questions about this Privacy Policy, please
                  contact us at:
                </p>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> privacy@learnify.com
                  </p>
                  <p>
                    <strong>Address:</strong> Education Innovation Hub, Accra,
                    Ghana
                  </p>
                  <p>
                    <strong>Phone:</strong> +233 24 123 4567
                  </p>
                </div>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
