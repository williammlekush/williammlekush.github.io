const app = {

   // These are the titles of the pages,
   // read later to specify how to acquire content for each page.
   pageTitles: {
      'home': 'William Mlekush',
      'about': 'About - William Mlekush',
      'cv': 'CV - William Mlekush'
   },

   // These are settings for mustache, read as "I want to add 'mustache' to 'targetElement'."
   mustacheSettings: {
      galleryToBody: {
         'mustache': 'gallery',
         'targetElement': 'body'
      },
      galleryBlockToGallery: {
         'mustache': 'galleryBlock',
         'targetElement': '.gallery',
      },
      aboutToBody: {
         'mustache': 'about',
         'targetElement': 'body',
      },
      cvToBody: {
         'mustache': 'cv',
         'targetElement': 'body'
      },
      cvSectionToCard: {
         'mustache': 'cvSection',
      },
      projectToBody: {
         'mustache': 'project',
         'targetElement': 'body'
      },
   },

   // On initialize, set up the client.
   initialize: function() {

      app.client = contentful.createClient({
         space:'s0xe8q8ao1vz',
         accessToken:'LhgIVHvxMQFIv5pudAPQsHw2BrhpeKLGTM-rDlh663Y',
      });   
   },

   // This method sets the navigation into the page.
   setNav: function() {
      // This switch checks if the page title is the CV page title.
      switch (document.title) {
         case app.pageTitles.cv: 
            // Get the cv navigation and prepend it to the body.
            app.getNav('/mustache/navCV.mustache');
            break;
            // Otherwise, get the main navigation.
         default: app.getNav('/mustache/navMain.mustache');
            break;
      };
      
      // Ensure the mobiel nav menu closes when the window passes the mobile break point.
      window.onresize = app.closeMobileMenu;
   },

   // This method sets the page content for each page.
   setPageContent: function() {

      // This switch checks the title of each page and gets and sets the appropriate content.
      switch (document.title){
         // For the homepage, append the gallery to the body and then the projects to the body.
         case app.pageTitles.home: 
            app.getMustache(app.mustacheSettings.galleryToBody);
            app.getAllProjects();
            break;
         // For the about page, get the about page data.
         case app.pageTitles.about:
            app.getAbout('4qE4vrC1bg8B3FF9lCN6ls');
            break;
         // For the CV, append the cv to the body and then the cv sections to the cv.
         case app.pageTitles.cv: 
            app.getMustache(app.mustacheSettings.cvToBody);
            app.getCVSections();
            break;
         default: break;
      };
   },

   // This method appends a given mustache template to a given taret element with given template data.
   getMustache: function({mustache, targetElement, templateData}) {

      // Fetch the given template
      fetch('/mustache/' + mustache + '.mustache')
      .then(response => response.text())
      .then(template => {
         
         // Render the template with the given data
         const rendered = Mustache.render(template, templateData);

         // Append the template to the target
         $(targetElement).append(rendered);
      });
   },

   // This method prepends the given nav mustache to the body.
   getNav: function(navMustache) {

      // Fetch the given template
      fetch(navMustache)
      .then(response => response.text())
      .then(template => {
         
         // Render the template
         const rendered = Mustache.render(template);

         // Prepend it to the body
         $('body').prepend(rendered);
      });
   },

   // This method gets the about page and appends it through mustache to the body.
   getAbout: function(aboutEntry) {

      // Get the given entry
      app.client.getEntry(aboutEntry).then(about => {

         // Assign the appropriate data
         const aboutData = {
            imageURL: `http:${about.fields.headshot.fields.file.url}`,
            imageTitle: about.fields.headshot.fields.title,
            blurb: documentToHtmlString(about.fields.aboutBlurb)
         };
         
         // Update mustache settings with the data
         app.mustacheSettings.aboutToBody.templateData = aboutData;

         // Load and append
         app.getMustache(app.mustacheSettings.aboutToBody)

      })
   },

   // This methods gets a particular project and appends it through mustache to the body.
   getProject: function(entry) {

      // Fetch a particular project
      app.client.getEntry(entry).then(project => {
         
         // These options ensure that embedded images in Contentful rich text are rendered.
         const options = {
            renderNode: {
                  'embedded-asset-block': ({data: {target: {fields}}}) => {
                     return `<img src="${fields.file.url}" height="${fields.file.details.image.height}" width="${fields.file.details.image.width}" alt="${fields.description}"/>`;
               }
            }
         };

         // Set the appropriate project data for the mustache template
         const projectData = {
            title: project.fields.title,
            imageURL: `http:${project.fields.featuredImage.fields.file.url}`,
            imageTitle: project.fields.featuredImage.fields.title,
            description: documentToHtmlString(project.fields.description, options),
            date: project.fields.dateCreated
         };

         // Update the mustache settings
         app.mustacheSettings.projectToBody.templateData = projectData;

         // Load and append
         app.getMustache(app.mustacheSettings.projectToBody);

      });
    },

   // This method gets all the projects from Contentful and adds them to the gallery.
   getAllProjects: function() {

      // Fetch all entries filtered for 'project'
      app.client.getEntries({
         'content_type': 'project'
      }).then(response => {

         // Sort response by display order
         response.items.sort((a,b) => (a.fields.displayOrder > b.fields.displayOrder) ? 1 : -1);
         // Go through each one
         response.items.forEach(project => {
            // Set the appropriate project data for the mustache template
            const projectData = {
            title: `${project.fields.title}`,
            imageURL: `http:${project.fields.featuredImage.fields.file.url}`,
            imageTitle: project.fields.featuredImage.fields.title,
            slug: `works/${project.fields.slug}.html`
            };
            
            // Update mustachesettings
            app.mustacheSettings.galleryBlockToGallery.templateData = projectData;

            // Load and append
            app.getMustache(app.mustacheSettings.galleryBlockToGallery);
         
         });
      });
   },

   // This method gets all the cv sections and adds them to the cv
   getCVSections: function() {

      // Fetch all entries of type cv-section
      app.client.getEntries({
         'content_type': 'cvSection'
      }).then(response => {
         
         // Sort
         response.items.sort((a,b) => (a.fields.displayOrder > b.fields.displayOrder) ? 1 : -1);

         // Iterate and retrieve data
         response.items.forEach(section => {
            const sectionData = {
               content: section.fields.sectionContent,
            };
            
            // This switch checks the type of each section and updates the target element of mustache settings accordingly
            switch (section.fields.type){
               // Education sections target the educaiton card
               case 'education':
                  app.mustacheSettings.cvSectionToCard.targetElement='.card--education';                
                  break;
               // Etc.
               case 'experience':
                  app.mustacheSettings.cvSectionToCard.targetElement='.card--experience';
                  break;
               case 'technicalSkills':
                  app.mustacheSettings.cvSectionToCard.targetElement='.card--technical-skills';                
            };

            // Update data, load, and append
            app.mustacheSettings.cvSectionToCard.templateData = sectionData;
            app.getMustache(app.mustacheSettings.cvSectionToCard);
         })
      })
   },

   // This method checks the window width and closes the mobile menu if it is greater than 1000px
   closeMobileMenu: function() {
      let navMenu = $('mobileNavMenu');
      let w = window.innerWidth;
      if(w > 1000) navMenu.style.display = "none";
  }

}

