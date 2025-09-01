export default function TermsOfServicePage() {
  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='prose prose-lg max-w-4xl mx-auto'>
        <h1>Terms of Service</h1>
        <p className='text-gray-600'>
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <section className='mt-8'>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Ingoma Tours services, you agree to be bound
            by these Terms of Service. If you do not agree to these terms,
            please do not use our services.
          </p>
        </section>

        <section className='mt-8'>
          <h2>2. Booking and Payments</h2>
          <ul>
            <li>All bookings are subject to availability</li>
            <li>A deposit of 50% is required to confirm your booking</li>
            <li>Full payment must be received during the tour</li>
            <li>Prices are in USD unless otherwise stated</li>
            <li>We accept major credit cards and bank transfers</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>3. Cancellation Policy</h2>
          <p>Our cancellation policy is as follows:</p>
          <ul>
            <li>
              60+ days before tour: Full refund minus processing fees and
              permits fees
            </li>
            <li>30-59 days before tour: 50% refund</li>
            <li>15-29 days before tour: 25% refund</li>
            <li>0-14 days before tour: No refund</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>4. Tour Modifications</h2>
          <p>
            Ingoma Tours reserves the right to modify tour itineraries due to
            weather, safety concerns, or other circumstances beyond our control.
            We will make reasonable efforts to provide comparable alternatives.
          </p>
        </section>

        <section className='mt-8'>
          <h2>5. Traveler Responsibilities</h2>
          <ul>
            <li>Provide accurate personal information</li>
            <li>Obtain necessary travel documents and visas</li>
            <li>Follow tour guide instructions</li>
            <li>Respect local customs and regulations</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>6. Liability</h2>
          <p>
            While we take all reasonable precautions to ensure your safety,
            Ingoma Tours is not liable for:
          </p>
          <ul>
            <li>Personal injury or loss of property</li>
            <li>
              Flight delays or cancellations but we will do our best to help you
              join the tour
            </li>
            <li>Natural disasters or force majeure events</li>
            <li>Third-party service providers</li>
          </ul>
        </section>

        <section className='mt-8'>
          <h2>7. Media Usage</h2>
          <p>
            We may take photographs during tours for promotional purposes. We
            ask for permission before posting your photo online.
          </p>
        </section>

        <section className='mt-8'>
          <h2>8. Contact Information</h2>
          <p>For questions about these terms, please contact us:</p>
          <p>Email: legal@ingomatours.com</p>
          <p>Phone: +250 781 499 058</p>
        </section>
      </div>
    </div>
  );
}
