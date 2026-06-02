jQuery(function($){
 

 // AJAX Stuff for filters + load more button

    /*
     * Load More
     */
    $('#prop_loadmore').click(function(){
    
    var url_string = window.location;
    var price_min = (new URL(url_string)).searchParams.get("price_min");
    var price_max = (new URL(url_string)).searchParams.get("price_max");
    var bedrooms = (new URL(url_string)).searchParams.get("beds");
    var property_type = (new URL(url_string)).searchParams.get("type");
    var sort_by = (new URL(url_string)).searchParams.get("sort_by");
    var the_page = (new URL(url_string)).searchParams.get("page");

    

        $.ajax({
            url : prop_loadmore_params.ajaxurl, 
            data : {
                'action': 'loadmorebutton',
                'query': prop_loadmore_params.posts, // loop parameters passed by wp_localize_script()
                'page' : prop_loadmore_params.current_page, // Get the current page
                'price_min' : price_min,
                'price_max' : price_max,
                'beds' : bedrooms,
                'type' : property_type,
                'sort_by' : sort_by,
                'the_page' : the_page
            },
            type : 'POST',
            beforeSend : function ( xhr ) {
               // $('#prop_loadmore').text( 'Loading...' ); 
                $('#prop_loadmore').addClass( 'loading' );
                    
            },
            success : function( posts ){
                if( posts ) {
                    $('#prop_loadmore').removeClass( 'loading' );
                    $('#prop_loadmore').text( 'Show More' );
                    $('#main_posts').append( posts ); 
                    
              
                    prop_loadmore_params.current_page++; // Increase current page by 1

                    var params = new URLSearchParams(location.search);
                    params.set('page', prop_loadmore_params.current_page);
                    window.history.replaceState({}, "", decodeURIComponent(`${location.pathname}?${params}`));
              

                    if ( prop_loadmore_params.current_page == prop_loadmore_params.max_page ) 
                        $('#prop_loadmore').hide(); // if last page, hide loadmore

                } else {
                    $('#prop_loadmore').hide(); // if no properties, hide loadmore
                }
            }
        });
        return false;
    });
 
    /*
     * Filter
     */
    $('#filter').change(function(){
 
        $.ajaxSetup({cache: false});

        $.ajax({
            url : prop_loadmore_params.ajaxurl,
            data : $('#filter').serialize(), 
            dataType : 'json',
            
            success : function( data ){
 
                // reset current page to 1 when filters on
                prop_loadmore_params.current_page = 1;
 
                prop_loadmore_params.posts = data.posts;
 
                // set max page
                prop_loadmore_params.max_page = data.max_page;

                found_posts = data.found_posts 

                //First pull out the empty strings

                var formData = $('#filter').serializeArray().filter(function (i) {
                    if(i.value != 'prop_filters') {
                        return i.value;
                    }
                });

                //Now push formData to URL
                window.history.pushState('', 'title', '?' + $.param(formData) + '&page=' + prop_loadmore_params.current_page);

                $('#main_posts').html(data.content);
                $('.listings-count').text( found_posts + ' Real Estate Listings');
                $('.listings-count-2').html('<strong>' + found_posts + '</strong> Real Estate Listings');

               
                if (found_posts > 9) {
                    $('#prop_loadmore').show();
                }
                 if ( prop_loadmore_params.current_page == prop_loadmore_params.max_page ) 
                        $('#prop_loadmore').hide(); // if last page, hide loadmore
           


 
                // If not enough posts for 2nd page, hide loadmore
                if ( data.max_page < 2 ) {
                    $('#prop_loadmore').hide();
                } else {
                    $('#prop_loadmore').show();
                }
            }
        });
        
        return false;
 
    });



$( ".reset" ).on( "click", function() {
    $("select").each(function() { this.selectedIndex = 0 }).trigger('change');
    var body = $("html, body");
    body.stop().animate({scrollTop:0}, 500, 'swing', function() {});
});


$(document).ready(function() {
   // $('#filter').trigger('change');
});
 
});

