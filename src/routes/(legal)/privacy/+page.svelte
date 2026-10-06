<script lang="ts">
	import ProsePage from '$lib/components/prose-page.svelte';
	import { SeoHead, pageTitle, type SeoMeta } from '$lib/features/seo';

	const meta: SeoMeta = {
		title: pageTitle('Privacy Policy'),
		description: 'What OfficeWatchParty collects, why, and how it is stored and protected.',
		path: '/privacy'
	};
</script>

<SeoHead {meta} />

<ProsePage title="Privacy Policy" lastUpdated="October 6, 2026">
	<p>
		This Privacy Policy explains what information OfficeWatchParty ("we", "us") collects when you
		use officewatchparty.com (the "Service"), how we use, store, and share it, and the choices you
		have.
	</p>

	<h2>1. Information We Collect</h2>
	<ul>
		<li>
			<strong>Account information</strong> — your email address, used to create your account and sign
			you in with a one-time code.
		</li>
		<li>
			<strong>Information from Google</strong> — if you choose to sign in with Google, we receive your
			name, email address, profile picture, and Google account ID. See section 2 for details.
		</li>
		<li>
			<strong>Content you create</strong> — watch party rooms, the people you add to them, comments, reactions,
			and trivia answers.
		</li>
		<li>
			<strong>Activity in the Service</strong> — episodes you watch and your playback progress, favorites,
			home page preferences, and whether you have seen a donation prompt.
		</li>
		<li>
			<strong>Technical information</strong> — your IP address, browser type, and request details, processed
			by our hosting provider to deliver and protect the Service.
		</li>
	</ul>

	<h2>2. Google User Data</h2>
	<p>
		Signing in with Google is optional. When you use it, we request only Google's basic sign-in
		permissions (<code>openid</code>, <code>email</code>, and <code>profile</code>). We do not
		access your Gmail, Google Drive, contacts, calendar, or any other Google data.
	</p>
	<ul>
		<li>
			<strong>What we access:</strong> your name, email address, profile picture, and Google account ID.
		</li>
		<li>
			<strong>How we use it:</strong> only to create your account, sign you in, and identify you within
			the Service. If you already have an account with the same email address, signing in with Google
			connects to that existing account.
		</li>
		<li>
			<strong>How we store it:</strong> with your account in our authentication provider, Supabase, encrypted
			in transit and at rest.
		</li>
		<li>
			<strong>How we share it:</strong> we do not sell, rent, or transfer Google user data to anyone,
			and we do not use it for advertising or to train AI or machine learning models. It is processed
			only by the service providers in section 5 as needed to run the Service, or disclosed if required
			by law.
		</li>
		<li>
			<strong>How to remove it:</strong> you can revoke OfficeWatchParty's access at any time from
			your
			<a href="https://myaccount.google.com/permissions" target="_blank" rel="noopener noreferrer"
				>Google Account permissions</a
			>
			page, and you can ask us to delete your data as described in section 8.
		</li>
	</ul>
	<p>
		OfficeWatchParty's use and transfer of information received from Google APIs will adhere to the
		<a
			href="https://developers.google.com/terms/api-services-user-data-policy"
			target="_blank"
			rel="noopener noreferrer">Google API Services User Data Policy</a
		>, including the Limited Use requirements.
	</p>

	<h2>3. How We Use Your Information</h2>
	<ul>
		<li>Sign you in and keep your account secure</li>
		<li>Run watch party rooms and control who can join them</li>
		<li>Show your comments and reactions, and save your favorites, trivia answers, and progress</li>
		<li>Keep the Service working, prevent abuse, and fix problems</li>
	</ul>
	<p>We do not use your information for advertising, and we do not sell it.</p>

	<h2>4. What Other Users Can See</h2>
	<ul>
		<li>
			When you post a comment, other users see it along with the part of your email address before
			the "@".
		</li>
		<li>
			If you own a room, you add people by email address, and you can see the email addresses of the
			people you added. If someone adds you to their room, they can see your email address.
		</li>
	</ul>

	<h2>5. Service Providers</h2>
	<p>We rely on these providers to operate the Service:</p>
	<ul>
		<li>
			<strong>Supabase</strong> — authentication and database hosting (<a
				href="https://supabase.com/privacy"
				target="_blank"
				rel="noopener noreferrer">privacy policy</a
			>).
		</li>
		<li>
			<strong>Cloudflare</strong> — website hosting and video storage (<a
				href="https://www.cloudflare.com/privacypolicy/"
				target="_blank"
				rel="noopener noreferrer">privacy policy</a
			>).
		</li>
		<li>
			<strong>Resend</strong> — delivery of sign-in code emails (<a
				href="https://resend.com/legal/privacy-policy"
				target="_blank"
				rel="noopener noreferrer">privacy policy</a
			>).
		</li>
		<li>
			<strong>Google</strong> — optional sign-in with your Google account (<a
				href="https://policies.google.com/privacy"
				target="_blank"
				rel="noopener noreferrer">privacy policy</a
			>).
		</li>
		<li>
			<strong>Stripe</strong> — donation payment processing. We never see or store your card details
			(<a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer"
				>privacy policy</a
			>).
		</li>
	</ul>

	<h2>6. Data Sharing</h2>
	<p>
		We do not sell or rent your personal information. We share it only with the providers above, as
		needed to run the Service, or when required by law.
	</p>

	<h2>7. Cookies</h2>
	<p>
		We use only essential cookies to keep you signed in. We do not use advertising or analytics
		cookies.
	</p>

	<h2>8. Data Retention and Deletion</h2>
	<p>
		We keep your information for as long as your account exists. To delete your account and all
		associated data, including any data received from Google, email
		<a href="mailto:support@officewatchparty.com">support@officewatchparty.com</a> from the address on
		your account. We will delete it within 30 days and confirm by email.
	</p>

	<h2>9. Security</h2>
	<p>
		Data is encrypted in transit and at rest, and database access rules limit what each user can
		read and change. No method of transmission or storage is completely secure, so we cannot
		guarantee absolute security.
	</p>

	<h2>10. Children's Privacy</h2>
	<p>
		The Service is not intended for children under 13. We do not knowingly collect personal
		information from children under 13. If we learn that we have, we will delete it.
	</p>

	<h2>11. Changes to This Policy</h2>
	<p>
		If we change this Privacy Policy, we will update the date at the top of this page. Continued use
		of the Service after changes means you accept the updated policy.
	</p>

	<h2>12. Contact</h2>
	<p>
		If you have questions about this Privacy Policy, please contact us at
		<a href="mailto:support@officewatchparty.com">support@officewatchparty.com</a>.
	</p>
</ProsePage>
