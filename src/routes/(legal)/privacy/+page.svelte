<script lang="ts">
	import ProsePage from '$lib/components/prose-page.svelte';
</script>

<svelte:head>
	<title>Privacy Policy - OWP</title>
</svelte:head>

<ProsePage title="Privacy Policy" lastUpdated="February 11, 2026">
	<h2>1. Information We Collect</h2>
	<p>We collect the following types of information:</p>
	<ul>
		<li>
			<strong>Account information</strong> — your email address, provided during sign-up through our authentication
			provider
		</li>
		<li>
			<strong>Usage data</strong> — information about how you interact with the Service, such as rooms
			joined, episodes watched, and favorites saved
		</li>
	</ul>

	<h2>2. How We Use Your Information</h2>
	<p>We use the information we collect to:</p>
	<ul>
		<li>Provide, maintain, and improve the Service</li>
		<li>Authenticate your identity and manage your account</li>
		<li>Enable features like watch rooms, favorites, and comments</li>
		<li>Monitor usage to ensure the Service runs smoothly</li>
	</ul>

	<h2>3. Third-Party Services</h2>
	<p>We rely on the following third-party services to operate:</p>
	<ul>
		<li>
			<strong>Supabase</strong> — authentication and database hosting. Subject to the
			<a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer"
				>Supabase Privacy Policy</a
			>.
		</li>
		<li>
			<strong>Stripe</strong> — donation payment processing. Subject to the
			<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
				>Stripe Privacy Policy</a
			>.
		</li>
	</ul>

	<h2>4. Data Sharing</h2>
	<p>
		We do not sell your personal information. We only share data with the third-party services
		listed above as necessary to operate the Service.
	</p>

	<h2>5. Cookies</h2>
	<p>
		The Service uses cookies for authentication and session management. These are essential for the
		Service to function and cannot be disabled.
	</p>

	<h2>6. Data Retention</h2>
	<p>
		We retain your data for as long as your account is active. If you delete your account, your
		personal data will be removed from our systems within a reasonable timeframe.
	</p>

	<h2>7. Security</h2>
	<p>
		We take reasonable measures to protect your data, including encryption in transit and at rest.
		However, no method of transmission or storage is completely secure, and we cannot guarantee
		absolute security.
	</p>

	<h2>8. Children's Privacy</h2>
	<p>
		The Service is not intended for children under 13. We do not knowingly collect personal
		information from children under 13. If we learn that we have collected such information, we will
		take steps to delete it.
	</p>

	<h2>9. Changes to This Policy</h2>
	<p>
		We may update this Privacy Policy from time to time. Continued use of the Service after changes
		constitutes acceptance of the updated policy.
	</p>

	<h2>10. Contact</h2>
	<p>
		If you have questions about this Privacy Policy, please contact us at
		<a href="mailto:support@officewatchparty.com">support@officewatchparty.com</a>.
	</p>
</ProsePage>
