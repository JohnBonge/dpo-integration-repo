export default function PrivacyPolicyPage() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='prose prose-lg max-w-4xl mx-auto'>
        <h1>Privacy Policy</h1>
        <p className='text-gray-600'>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className='mt-8'>
          <h2>1. Information We Collect</h2>
          <p>
            When you use Ingoma Tours, we collect information that you provide
            directly to us, including:
          </p>
          <ul>
            <li>Name and contact information</li>
            <li>Booking and travel preferences</li>
            <li>Payment information</li>
            <li>Communication history</li>
            <li>Travel documents and identification</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your bookings and payments</li>
            <li>Communicate with you about your tours</li>
            <li>Improve our services</li>
            <li>Send you marketing communications (with your consent)</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>3. Information Sharing</h2>
          <p>
            We share your information with trusted partners only when necessary
            to provide our services:
          </p>
          <ul>
            <li>Tour operators and guides</li>
            <li>Payment processors</li>
            <li>Transportation providers</li>
            <li>Hotels and accommodation providers</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>4. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal
            information.
          </p>
        </section>

        <section className='mt-8'>
          <h2>5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal information</li>
            <li>Correct inaccurate information</li>
            <li>Request deletion of your information</li>
            <li>Opt-out of marketing communications</li>
            <li>Withdraw consent</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us
            at:
          </p>
          <p>Email: privacy@ingomatours.com</p>
          <p>Phone: +250 781 499 058</p>
        </section>
      </div>
    </div>
  );
}
