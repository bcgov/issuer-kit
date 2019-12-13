export const emailTemplate = (url: string, adminAddress: string) => {
  return `<p>
You have received this invitation from ${adminAddress}. If you have any
questions please contact them by sending an email to <a href="mailto:${adminAddress}">${adminAddress}</a>. 
</p>
<p>
This proof of concept is facilitated by the Digital ID and Authentication
Council of Canada. The purpose of this proof of concept is to provide an example
demonstration of how digital id for verified persons could work as set out in
the Pan-Canadian Trust Framework.
</p>
<p>
There are three steps:
</p>
<ol>
<li>Setup by installing a mobile app (personal agent) and completing other prerequisite activities
<li>Obtain your proof of concept digital for a verified person from the BC POC issuing service
<li>Use your digital ID at one or more of the proof of concept demonstration
services that have been provided by participating DIACC members
</li>
</ol>
<p>
Step 1: Setup
</p>
<ol>
<li>You must have an active login account from one of the following: 
<ol>
<li>Github account, please populate the name fields of your github account profile - <a href="https://github.com/">Click here to sign for a free account</a>
<li>Other options are TBD...
</li> 
</ol>
<li>Install a smartphone app that you will use as your personal agent for
receiving, holding, and sharing verifiable credentials that are issued to you.
Please install one of the following: 
<ol>    
<li>Streetcred, currently only for iPhone or iPad. Please make special note of
the extra details for this step since the demo will not work unless you follow
the app setup instructions <a href="https://github.com/bcgov/identity-kit-poc/blob/master/docs/GettingApp.md">here</a>.
<li>Other agents are TBD and are expected to be created by POC participants.
</li> 
</ol>
</li> 
</ol>
<p>
Step 2: Obtain your proof of concept digital ID for verified person
</p>
<p>
This step works best if you have an additional device such as a laptop
or tablet that can display the screens for the issuing service.
<b>Using your laptop or tablet click the following link to
start the process for issuing your digital ID for verifiable person:</b>
</p>
<p><b><a href="${url}">${url}</a></b></p>
<p>Login using your github account and authorize the invitation service to connect to your account.
</p>
<p>
You can use this link multiple times to allow for demonstrations you may want
to do. If you find that the link has expired, please request a new invitation
by sending an email to  <a href="mailto:${adminAddress}">${adminAddress}</a>. 
</p>
<p>
Step 3: Use your proof of concept digital ID at proof of concept demonstration services. 
</p>
<p>
Currently the following services are available:
</p>
<p>
We have found it works best if you use a second device such as a laptop
or tablet for running these demo services. Please close and restart your
browser to be sure that the github login is cleared away before running
the demo services.
</p>
<ol>
<li>Demo Test Service - from your laptop or tablet click on the
following link: <a href="https://law-society-demo.pathfinder.gov.bc.ca/">https://law-society-demo.pathfinder.gov.bc.ca/</a>. 
After the page loads click the button for verifiable credential and scan the QR code with your personal
agent app that you installed in Step 1: Setup above.
<li>Others demo services are TBD with expectation that POC participants will provide examples.
</li>
</ol>
<p>
DISCLAIMER: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec
odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at
nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus
sed augue semper porta. Mauris massa. Vestibulum lacinia arcu eget nulla. Class
aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
himenaeos. Curabitur sodales ligula in libero. Sed dignissim lacinia nunc.
Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor.
Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas
porttitor. Morbi lectus risus, iaculis vel, suscipit quis, luctus non, massa.
Fusce ac turpis quis ligula lacinia aliquet. Mauris ipsum. Nulla metus metus,
ullamcorper vel, tincidunt sed, euismod in, nibh. Quisque volutpat condimentum
velit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per
inceptos himenaeos. Nam nec ante. Sed lacinia, urna non tincidunt mattis, tortor
neque adipiscing diam, a cursus ipsum ante quis turpis. Nulla facilisi. Ut
fringilla. Suspendisse potenti. Nunc feugiat mi a tellus consequat imperdiet.
Vestibulum sapien. Proin quam. Etiam ultrices. Suspendisse in justo eu magna
luctus suscipit. Sed lectus. Integer euismod lacus luctus magna. Quisque cursus,
metus vitae pharetra auctor, sem massa mattis sem, at interdum magna augue eget
diam. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
cubilia Curae; Morbi lacinia molestie dui. Praesent blandit dolor. Sed non quam.
In vel mi sit amet augue congue elementum. Morbi in ipsum sit amet pede
facilisis laoreet. Donec lacus nunc, viverra nec.
</p>`;
};
