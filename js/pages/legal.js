export async function renderPrivacy(root) {
  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">LEGAL</span>
        <h1>Privacy Policy</h1>
        <p>How Every Details Education Consultancy uses the information you share with us.</p>
      </div>
    </section>
    <section class="section">
      <div class="container legal-copy">
        <p>Every Details Education Consultancy, Dumri Road, Gobarsahi, Muzaffarpur, Bihar (“we”) collects details only to counsel you for Indian university admissions.</p>
        <h2>What we collect</h2>
        <ul>
          <li>Name, phone, email, course interest, and message from enquiry forms</li>
          <li>WhatsApp number if you ask for admission updates</li>
          <li>Basic technical data such as browser type when you open this website</li>
        </ul>
        <h2>How we use it</h2>
        <p>We use this information to contact you, shortlist colleges, process applications, and send admission updates you requested. We do not sell your data.</p>
        <h2>Sharing</h2>
        <p>We may share only what a university or our counsellor needs to complete your file. Hosting and email providers may process data to keep the site and mailbox running.</p>
        <h2>Contact</h2>
        <p>Questions: <a href="mailto:info.everydetails@gmail.com">info.everydetails@gmail.com</a> or the numbers on this website.</p>
      </div>
    </section>
  `;
}

export async function renderTerms(root) {
  root.innerHTML = `
    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">LEGAL</span>
        <h1>Terms &amp; Conditions</h1>
        <p>Please read these terms before using everydetails.in or our counselling service.</p>
      </div>
    </section>
    <section class="section">
      <div class="container legal-copy">
        <p>This website is operated by Every Details Education Consultancy, Muzaffarpur, Bihar. By using the site or submitting an enquiry you agree to these terms.</p>
        <h2>Our role</h2>
        <p>We provide admission counselling for Indian universities (regular and correspondence). We are not a university and do not guarantee a seat, scholarship, or result. Final admission depends on the institution and your documents.</p>
        <h2>Information on this site</h2>
        <p>Course lists, college names, and photos are for guidance. Confirm fees, eligibility, and intake with us or the university before you pay anyone.</p>
        <h2>Enquiries</h2>
        <p>Form submissions and WhatsApp messages should be accurate. We may call or message the number you give to continue counselling.</p>
        <h2>Liability</h2>
        <p>We are not responsible for university delays, rejected applications, or decisions made by third parties. These terms are governed by the laws of India, with Muzaffarpur, Bihar as the place of jurisdiction.</p>
        <h2>Contact</h2>
        <p><a href="mailto:info.everydetails@gmail.com">info.everydetails@gmail.com</a></p>
      </div>
    </section>
  `;
}
