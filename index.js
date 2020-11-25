const app = {

   pageTitles: {
      'home': 'William Mlekush',
      'about': 'About - William Mlekush',
      'cv': 'CV - William Mlekush'
   },

   mustacheSettings: {
      galleryToBody: {
         'mustache': 'gallery.mustache',
         'targetElement': 'body'
      },
      galleryBlockToGallery: {
         'mustache': 'galleryBlock.mustache',
         'targetElement': '.gallery',
      },
      aboutToBody: {
         'mustache': 'about.mustache',
         'targetElement': 'body',
      }
   },


   initialize: function() {

      app.client = contentful.createClient({
         space:'s0xe8q8ao1vz',
         accessToken:'LhgIVHvxMQFIv5pudAPQsHw2BrhpeKLGTM-rDlh663Y',
      });   

      switch (document.title) {
         case app.pageTitles.cv: 
            app.getNav('navCV.mustache');
            break;
         default: app.getNav('navMain.mustache');
            break;
      };

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
      
      window.onresize = app.closeMobileMenu;
   },

   getMustache: function({mustache, targetElement, templateData}) {
      fetch(mustache)
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
        const projectData = {
          title: project.fields.title,
          imageURL: `http:${project.fields.featuredImage.fields.file.url}`,
          imageTitle: project.fields.featuredImage.fields.title,
          description: documentToHtmlString(project.fields.description)
        };

        // load the template for this item from a local file
        fetch('projectPage.mustache')
          .then(response => response.text())
          .then(template => {
            // render the template with the data
            const rendered = Mustache.render(template, projectData);
            // add the element to the container
            $('.content').append(rendered);
          }
        );
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

   setMasonryGrid: function({gridContainer = '.masonry-grid', gridSizer = '.grid-sizer', gridItem = '.grid-item'}) {
            
      const grid = $(gridContainer);

      const msnry = new Masonry( grid, {
          columnWidth: gridSizer,
      itemSelector: gridItem,
      percentPosition: true             
      });

      imagesLoaded( grid ).on( 'progress', function() {
      msnry.layout();
      });
   },

   closeMobileMenu: function() {
      let navMenu = $('mobileNavMenu');
      let w = window.innerWidth;
      if(w > 1000) navMenu.style.display = "none";
      
  }

}

