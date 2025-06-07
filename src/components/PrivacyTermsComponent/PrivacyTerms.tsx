

export default function PrivacyTerms() {


    return (
        <div className="PrivacyTermsComponent">
            {/* Privacy Policy */}
            <section className="PrivacyTerms">
                <h1>Privacy Policy</h1>

                <article className="privacyTermsIntroArticle">
                    <p className="privacyTermsIntro">
                        We collect personal information (e.g., name, email) when you register, subscribe, or comment, and
                        automatically gather non-personal data (e.g., IP address, browser type) when you browse. We use
                        this information to operate the site, send essential communications, personalize content, and
                        improve our services.
                    </p>
                    <img src="/data-collection.png" alt="" />
                </article>

                <article className="privacyTermsCookiesArticle">
                    <section className="privacyTermsCookiesSectionMain">
                        <img src="/service-provider.png" alt="" />
                        <section className="privacyTermsCookiesSection">
                            <h3 className="privacyTermsDataSharing">Data Sharing</h3>
                            <p className="privacyTermsDataSharingParagraph">
                                Your data may be shared with service providers (analytics, email, hosting) under strict
                                confidentiality obligations. We won't sell your personal information to third parties.
                            </p>
                        </section>
                    </section>

                    <section className="privacyTermsCookiesSectionMain">
                        <img src="/users-rights.png" alt="" />
                        <section>
                            <h3 className="privacyTermsUserRights">User Rights</h3>

                            <p className="privacyTermsDataSharingParagraph">
                                You can access, update, or request deletion of your personal data by contacting us at
                                support@thedailylens.com. We retain some data as required by law or for legitimate business
                                purposes.
                            </p>
                        </section>
                    </section>

                </article>

            </section>

            {/* Terms of Use */}
            <section className="PrivacyTermsSecond">
            <h1>Terms of Use</h1>



            <article className="termsIntroArticle">
                <p className="termsIntro">
                    By using TheDailyLens, you agree not to post unlawful, defamatory, or harmful content, and not to
                    disrupt the site's functionality. All site content (text, images, logos) is owned by us or our
                    licensors, and is protected by intellectual property laws. You may view and print articles for
                    personal, non-commercial use only.
                </p>
                <img src="/legal-document.png" alt="" />
            </article>


            <article className="termsContentArticle">   
                <section className="termsContentSection">
                    <img src="/registration.png" alt="" />
                    <section className="termsContentSection">
                        <h3 className="termsAccounts">Accounts</h3>

                        <p className="termsAccountsParagraph">
                            Some features require registration. You must provide accurate information, keep your credentials
                            secure, and be responsible for all activity on your account.
                        </p>
                    </section>
                </section>

                <section  className="termsContentSection">
                    <img src="/damage.png" alt="" />
                    <section className="termsContentSection">
                        <h3 className="termsLiability">Disclaimer & Liability</h3>

                        <p className="termsLiabilityParagraph">
                            The site and its content are provided “as is” without warranties. We are not liable for any
                            damages arising from your use of the site. These terms are governed by the laws of Bulgaria.
                        </p>
                    </section>
                </section>
            </article>



            <article className="termsChangesArticle">
                <img src="/feedback.png" alt="" />
                <section>
                    <h3 className="termsChanges">Changes to Terms</h3>

                    <p className="termsChangesParagraph">
                         We may update these Terms at any time by posting the revised version on this page. 
                         Any changes become effective immediately upon posting, unless otherwise noted. 
                         Continued use of the site after changes have been posted indicates your acceptance of the new Terms.
                    </p>
                </section>
            </article>



            </section>
        </div>
    )


}