const app = {

   initialize: function () {
      app.setNav();

      app.client = contentful.createClient({
         space:'s0xe8q8ao1vz',
         accessToken:'LhgIVHvxMQFIv5pudAPQsHw2BrhpeKLGTM-rDlh663Y',
      });            
      
      window.onresize = app.closeMobileMenu;
   },

   setNav: function () {
      // load main nav bars
      fetch('navMain.mustache')
      .then(response => response.text())
      .then(template => {
         const rendered = Mustache.render(template);

         $('body').prepend(rendered);
      });
   },

   getEntry: function(entry) {
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

   getAllEntries: function() {
      // fetch all entries
      app.client.getEntries().then(response => {
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

            // load the template for this item from a local file
            fetch('projectGalleryBlock.mustache')
            .then(response => response.text())
            .then(template => {
               // render the template with the data
               const rendered = Mustache.render(template, projectData);

               // add the element to the grid
               $('.project-gallery').append(rendered);
            }
            );
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

