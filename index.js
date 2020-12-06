const app = {

   pageTitles: {
      'home': 'William Mlekush',
      'about': 'About - William Mlekush',
      'cv': 'CV - William Mlekush'
   },

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


   initialize: function() {

      app.client = contentful.createClient({
         space: config.SPACE,
         accessToken: config.API_TOKEN
      });   
   },

   setNav: function() {
      switch (document.title) {
         case app.pageTitles.cv: 
            app.getNav('/mustache/navCV.mustache');
            app.getMustache(app.mustacheSettings.cvToBody);
            app.getCVSections();
            break;
         default: app.getNav('/mustache/navMain.mustache');
            break;
      };

      window.onresize = app.closeMobileMenu;
   },

   setPageContent: function() {
      switch (document.title){
         case app.pageTitles.home: 
            app.getMustache(app.mustacheSettings.galleryToBody);
            app.getAllProjects();
            break;
         case app.pageTitles.about: {
            app.getAbout('4qE4vrC1bg8B3FF9lCN6ls');
            break;
         }
         default: break;
      };
   },

   getMustache: function({mustache, targetElement, templateData}) {
      fetch('/mustache/' + mustache + '.mustache')
      .then(response => response.text())
      .then(template => {
         const rendered = Mustache.render(template, templateData);

         $(targetElement).append(rendered);
      });
   },

   getNav: function(navMustache) {
      // load main nav bars
      fetch(navMustache)
      .then(response => response.text())
      .then(template => {
         const rendered = Mustache.render(template);
         $('body').prepend(rendered);
      });
   },

   getAbout: function(aboutEntry) {
      console.log('got about!')
      app.client.getEntry(aboutEntry).then(about => {
         console.log(about);
         const aboutData = {
            imageURL: `http:${about.fields.headshot.fields.file.url}`,
            imageTitle: about.fields.headshot.fields.title,
            blurb: documentToHtmlString(about.fields.aboutBlurb)
         };
         
         app.mustacheSettings.aboutToBody.templateData = aboutData;
         app.getMustache(app.mustacheSettings.aboutToBody)

      })
   },

   getProject: function(entry) {
      // fetch a particular project
      app.client.getEntry(entry).then(project => {
        console.log(project);

        const options = {
         renderNode: {
               'embedded-asset-block': ({data: {target: {fields}}}) => {
                  debugger;
                  return `<img src="${fields.file.url}" height="${fields.file.details.image.height}" width="${fields.file.details.image.width}" alt="${fields.description}"/>`;
            }
         }
      };

        const projectData = {
          title: project.fields.title,
          imageURL: `http:${project.fields.featuredImage.fields.file.url}`,
          imageTitle: project.fields.featuredImage.fields.title,
          description: documentToHtmlString(project.fields.description, options),
          date: project.fields.dateCreated
        };

        // load the template for this item from a local file
        app.mustacheSettings.projectToBody.templateData = projectData;
        app.getMustache(app.mustacheSettings.projectToBody);

      });
    },

   getAllProjects: function() {
      // fetch all entries
      app.client.getEntries({
         'content_type': 'project'
      }).then(response => {
         console.log(response);
         // sort response by display order
         response.items.sort((a,b) => (a.fields.displayOrder > b.fields.displayOrder) ? 1 : -1);
         // go through each one
         response.items.forEach(project => {
            // pull out the data you're interested in
            const projectData = {
            title: `${project.fields.title}`,
            imageURL: `http:${project.fields.featuredImage.fields.file.url}`,
            imageTitle: project.fields.featuredImage.fields.title,
            slug: `works/${project.fields.slug}.html`
            };
            
            app.mustacheSettings.galleryBlockToGallery.templateData = projectData;
            app.getMustache(app.mustacheSettings.galleryBlockToGallery);
         
         });
      });
   },

   getCVSections: function() {
      app.client.getEntries({
         'content_type': 'cvSection'
      }).then(response => {
         console.log(response);
         response.items.sort((a,b) => (a.fields.displayOrder > b.fields.displayOrder) ? 1 : -1);
         response.items.forEach(section => {
            const sectionData = {
               content: section.fields.sectionContent,
            };

            switch (section.fields.type){
               case 'education':
                  app.mustacheSettings.cvSectionToCard.targetElement='.card--education';                
                  break;
               case 'experience':
                  app.mustacheSettings.cvSectionToCard.targetElement='.card--experience';
                  break;
               case 'technicalSkills':
                  app.mustacheSettings.cvSectionToCard.targetElement='.card--technical-skills';                
            };

            app.mustacheSettings.cvSectionToCard.templateData = sectionData;
            app.getMustache(app.mustacheSettings.cvSectionToCard);
         })
      })
   },

   closeMobileMenu: function() {
      let navMenu = $('mobileNavMenu');
      let w = window.innerWidth;
      if(w > 1000) navMenu.style.display = "none";
  }

}

