
var ui_lang = "en";     // SET DEFAULT UI LANGUAGE HERE!   
var apikey = ""         // place for your Flickr API key

// GLOBALs
var wikipedia = "http://fi.wikipedia.org/wiki/"
var wikidata = "http://wikidata.org/wiki/"
var commons = "http://commons.wikimedia.org/wiki/";
var base = "http://commons.wikimedia.org/w/index.php?title=Special:ExpandTemplates&wpInput=";
var licenses={4: '{{Template:Cc-by-2.0}}',5:'{{Template:Cc-by-sa-2.0}}',7:'{{Template:Flickr-no_known_copyright_restrictions}}'};
var licensesPlain={4: 'Cc-by-2.0',5:'Cc-by-sa-2.0',7:'No known copyright restrictions'};
var cloneCount = 0;
var lang = {};

 
 
$(document).ready(function(){

    lang = langs[ui_lang]; 

	//translate the whole thing!	
	for (var i in lang) {
		$('#' + i).html(lang[i]);
	}
    
    // set API key
    if (apikey != '')
        $("#apikey").val(apikey);

	// create UI language selection
	//for (var i in langs) {
	//	$('#ui_lang_sel').append('<option value="'+langs[i].code+'">'+langs[i].ui_lang+'</option');
	//}

    //$("#ui_lang_sel").val(ui_lang);

    // language chooser event
    //$("#ui_lang_sel").on("change", function() {
    //    lang = langs[$(this).val()];
    //	for (var i in lang) {
	//	    $('#' + i).html(lang[i]);
	//    }
    //});

    // add click events
    $( "#all_remove_time" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val(removeTime($(this).val()));
        });
    });
    
    $( "#all_leave_year" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val(leaveYear($(this).val()));
        });
    });

    $( "#all_remove_creator" ).on( "click", function(e) {
        $(".author").each(function() {
            $(this).val(removeCreator($(this).val()));
        });
    });

    $( "#all_add_creator" ).on( "click", function(e) {
        $(".author").each(function() {
            var author = removeCreator($(this).val());
            $(this).val("{{creator:" + author + "}}");
        });
    });

    $( "#all_add_institution" ).on( "click", function(e) {
        $(".keeper").each(function() {
            var author = removeCreator($(this).val());
            $(this).val("{{creator:" + author + "}}");
        });
    });

    // buttons
    $("#submit").click(function() {
        fetchSet();
    	}); 
    $("#dummy").click(function() {
        dummySet();
    	}); 
    $("#replace").click(function() {
        searchAndReplace();
    	});
    $("#convert").click(function() {
        convertSet();
    	}); 
    $("#convertWIKI").click(function() {
        convertSet2WIKI();
    	}); 
});






function fetchSet() {

	// create language selections according to select language
	for (var i in lang.languages) {
		$('.language_selection').append('<option value="'+i+'">'+lang.languages[i]+'</option');
	}

    var setid = $("#setid").val();
    if ($("#apikey").val() == '') {
        alert(lang.set_api_key);
        return;
    }
    apikey =  $("#apikey").val().trim();
    
    // remove previous fetch
    $("#photos").empty();
    
    // start query chain
    var jqxhr = $.get( "https://api.flickr.com/services/rest/?method=flickr.photosets.getInfo&api_key="+apikey+"&photoset_id="+setid, function(data) {
	    $xml = $(data) 
	    if ($xml.find("err").length) {
	        alert($xml.find("err").attr('msg'));
	        return;
	    }
	    var desc = $xml.find("photoset");
	    $( "#set" ).append( desc.attr("username"));
	    $( "#set" ).append( $xml.find("description").text());
	    fetchImages();
    })
      .done(function() {
      })
      .fail(function() {
        alert( lang.query_error );
      })
      .always(function() {
      });
}

 

function fetchImages() {

    var i = 0;
    var setid = $("#setid").val();
    var jqxhr = $.get( "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&api_key="+apikey+"&photoset_id="+setid, function(data) {
	    $(data).find("photo").each(function(index) {
	        if (i >= $("#imgcount").val()) { return }
		    $( "#photos" ).append( "<div>"+$(this).text()+"</div>");
		    //$( "#photos" ).append( $(this).attr("id"));
		    var cont = $('<table><tr><th>Flickr-data</th><th>Commons-data</th></tr><tr> <td class="info"><div class="div_img"></div><div class="imgurl"></div></td> <td class="xml"></td> </table>');
		    $("#photos").append(cont);
		    fetchURL($(this).attr("id"), cont);
		    fetchInfo($(this).attr("id"), cont);
		    i = i + 1;
	    });
	
    })
      .done(function() {
      })
      .fail(function() {
        alert( lang.query_error  );
      })
      .always(function() {
      });
     
}




function fetchURL(photoid, cont) {

    var jqxhr = $.get( "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apikey+"&photo_id="+photoid, function(data) {
	    var d = $(data).find('size[label="Medium"]').attr("source");
	    cont.find(".div_img").append('<img src="'+d+'" /><br />');
	    cont.find(".imgurl").append(d);
	    cont.find(".imgurl").val(d);
    })
      .done(function() {
      })
      .fail(function() {
        alert( lang.query_error  );
      })
      .always(function() {
      });
}



function fetchInfo(photoid, cont) {

    var jqxhr = $.get( "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+apikey+"&photo_id="+photoid, function(data) {
	    $xml = $(data);
	    var license = $xml.find('photo').attr("license").trim();
	    if (license != '7' && license != '5' && license != '4') {
	        cont.find(".info").append("<h2>" + $xml.find('title').text() + "</h2>"); 
	        cont.find(".xml").append('<div class="license_alert">Non-free license! </div>'); 
	        return;
	    }

	    cont.find(".info").append("<h2>" + $xml.find('title').text() + "</h2>"); 
	    cont.find(".info").append("<div>" + licensesPlain[license] + "</div>"); 
	    cont.find(".info").append( "<div><h3>kuvaus:</h3> " + $xml.find("description").text() + "</div>"); 

	    cont.find(".info").append( "<div><h3>username:</h3> " + $xml.find("owner").attr("username") + "</div>"); 
	    cont.find(".info").append( "<div><h3>realname:</h3> " + $xml.find("owner").attr("realname") + "</div>");
	    cont.find(".info").append( "<div><h3>kuva otettu:</h3> " + $xml.find("dates").attr("taken") + "</div>");
        
        // title
        var title = $xml.find('title').text();
        insertInput2("#multi_holder","#basic_lang_input", lang.titles, "title", cont.find(".xml"));
	    cont.find(".title").val(title); 

	    // author
        insertInput2("#multi_holder","#basic_input", lang.authors, "author", cont.find(".xml"));
        cont.find(".author").parent().append('<div class="link add_creator">'+lang.add_creator+'</div> | ');
	    cont.find(".author").parent().append('<div class="link remove_creator">'+lang.remove_creator+'</div> | ');
	    cont.find(".author").parent().append('<div class="link open_commons">'+lang.search_template+'</div>');


	    // description
	    insertInput2("#multi_textarea_holder","#textarea_input", lang.descriptions, "description", cont.find(".xml"));
	    cont.find(".description").val($xml.find("description").text()); 

	    // depicted person (photgraph template)
	    insertInput2("#multi_holder","#basic_input_data_auto", lang.depicted_people, "depictedperson", cont.find(".xml"));
	    //cont.find(".depictedperson").parent().append('<div class="link add_wikipedia">Lisää Wikimedia-linkki</div>');
        
	    // depicted place (photgraph template)
	    insertInput2("#multi_holder","#basic_input_data_auto", lang.depicted_place, "depictedplace", cont.find(".xml"));
	    //cont.find(".depictedplace").parent().append('<div class="link add_wikipedia">Lisää Wikimedia-linkki</div>');

	    // date
	    insertInput2("#basic_holder","#basic_input", lang.date, "date", cont.find(".xml"));
	    cont.find(".date").val($xml.find("dates").attr("taken"));
	    cont.find(".date").parent().append('<div class="link remove_time">'+lang.remove_time+'</div> | ');
	    cont.find(".date").parent().append('<div class="link leave_year">'+lang.leave_year+'</div>');
	
	    // keeper
	    insertInput2("#basic_holder","#basic_input", lang.keeper, "keeper", cont.find(".xml"));
	    cont.find(".keeper").val($xml.find("owner").attr("realname"));
	    cont.find(".keeper").parent().append('<div class="link add_institution">'+lang.add_institution+'</div> | ');
	    cont.find(".keeper").parent().append('<div class="link remove_institution">'+lang.remove_institution+'</div> | ');
	    cont.find(".keeper").parent().append('<div class="link open_commons">etsi mallinetta</div>');

	    // license
	    insertInput2("#basic_holder","#basic_input", lang.rights, "license", cont.find(".xml"));
	    cont.find(".license").val(licenses[license]);
	    cont.find(".license").attr('readonly', 'readonly');

        // preview
        cont.find(".xml").append('<div class="holder"><div class="divtitle">Preview </div><div class="frame div_preview"> </div></div>');
        cont.find(".div_preview").append('<div class="link preview">Preview in a new window</div>');
    })
  .done(function() {
        addEvents(cont);
    })
  .fail(function() {
        alert( lang_query_error );
  })
  .always(function() {
  });
}

function insertInput2(holderName, inputName, divTitle, inputTitle, cont) {
	var d = $(holderName).first().clone();
	d.find(".input_holder").append($(inputName).first().clone());
	d.find(".div_title").text(divTitle);
	d.find(".input_title").text(inputTitle+':');
	addAutocomplete(d.find(".autocomplete"));
	d.find(".rename_me").addClass(inputTitle);
	cont.append(d);
} 


function addEvents(cont) {

      cont.find( ".openwikidata" ).on( "click", function(e) {
        var name = $( this ).parent().siblings("input").val().trim();
        name = name.replace("{{creator:","");
        name = name.replace("}}","");
        //name = name.replace(/\[|\]:/ig,"");
        name = name.replace(/\[\[d:|\|(.*?)\]|\]/g, "");
        window.open(wikidata + name, "_blank");
    });

    cont.find( ".open_commons" ).on( "click", function(e) {
        var name = removeCreator($( this ).parent().find("input").val());
        name = "Creator:" + name;
        window.open(commons + name, "_blank");
    });
    
    cont.find( ".addinput" ).on( "click", function(e) {
        // clone first element in "input_holder"
        var newid = "cloned_" + (cloneCount++); // Generates a unique id
        var d = $(this).parent().find(".input_holder").first().clone();
        d.find("input").val("");
        d.find("input").attr('id',newid);
        addAutocomplete(d.find("input"));
        var holder = $(this).parent().find(".frame");
        holder.append(d);
        addEvents(d);
    });

    cont.find( ".add_creator" ).on( "click", function(e) {
        var field = $( this ).parent().find("input");
        var name = removeCreator(field.val().trim());
        name = "{{creator:" + name + "}}";
        field.val(name);
    });

    cont.find( ".remove_creator" ).on( "click", function(e) {
        var field = $( this ).parent().find("input");
        var name = field.val().trim().replace(/{{creator:|}}/g,"");
        field.val(name);
    });

    cont.find( ".add_institution" ).on( "click", function(e) {
        var field = $( this ).parent().find("input");
        var name = removeInstitution(field.val());
        name = "{{institution:" + name + "}}";
        field.val(name);
    });

    cont.find( ".remove_institution" ).on( "click", function(e) {
        var field = $( this ).parent().find("input");
        author = removeInstitution(field.val());
        field.val(author);
    });

    cont.find( ".remove_time" ).on( "click", function(e) {
        var field = $( this ).parent().find("input");
        field.val(removeTime(field.val()));
    });

    cont.find( ".remove_all_time" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val(removeTime($(this).val()));
        });
    });

    cont.find( ".leave_year" ).on( "click", function(e) {
        var field = $( this ).parent().find("input");
        field.val(leaveYear(field.val()));
    });

    cont.find( ".preview" ).on( "click", function(e) {
        var base = "http://commons.wikimedia.org/w/index.php?title=Special:ExpandTemplates&wpInput=";
        var wikicode = convertSet2WIKI($(this));
        window.open(base+wikicode,'_blank');
    });
}



function addAutocomplete(input) {

	$(input).autocomplete({
		source: function( request, response ) {
		    
			$.ajax({
				//url: "http://en.wikipedia.org/w/api.php?action=query&prop=pageprops&format=json&ppprop=wikibase_item&titles="+request.term,
				url: "https://www.wikidata.org/w/api.php?action=wbsearchentities&search="+request.term+"&format=json&language=fi&type=item&continue=0",
				dataType: "jsonp",
				success: function( data ) {
				    var items = []
				    
			        for (ent in data.search) {
				        var did = data.search[ent].id;
				        var desc = did + ' (' + lang.desc_missing + ')';
				        if (data.search[ent].description !== undefined) {
                            desc = data.search[ent].description;
                        }
				            
				        items.push({'label':data.search[ent].label,'value':did,'desc':desc});
				        
			        }
					response(items);
				}
			});
		},
		minLength: 3,
		select: function( event, ui ) {
				$(this).val('[[d:'+ui.item.value+'|'+ui.item.label+']]'); 
				return false;
		},
		open: function() {
			$( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
		},
		search: function( event, ui ) {
		    input.parent().addClass('hilite');
		},
		response: function( event, ui ) {
		    input.parent().removeClass('hilite');
		},
		close: function() {
			$( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
		}
	})
	 .autocomplete( "instance" )._renderItem = function( ul, item ) {
        return $( "<li>" )
        .append( "<b>" + item.label + "</b><br>" + item.desc  )
        .appendTo( ul );
    };
	
}


function addWikidataLink (field, wikidata_id) {
    text = removeWikidataLink(field.val().trim());
    field.val("[[d:" + wikidata_id + "|"+text+"]]");	
    
}

function removeCreator(name) {
    name = name.trim();
    return name.replace(/{|}|Creator:/ig,""); // TODO:use regExp object
}

function removeInstitution(name) {
    name = name.trim();
    return name.replace(/{|}|institution:/ig,""); // TODO:use regExp object
}

function removeTime(date) {
    var splitted = date.split(" ");
    return splitted[0];

}

function leaveYear(date) {
    var start = removeTime(date);
    var splitted = start.split("-");
    return splitted[0];

}

function searchAndReplace(etsi, korvaa) {

    var searchText = $("#searchText").val();
    var replaceText = $("#replaceText").val();
    var field = $("#fieldSelect").val();
    $("#photos").find('.'+field).each(function() {
        var text = $(this).val();
        $(this).val(text.replace(searchText, replaceText)); 
    });

}



function convertSet() {
    var xml = "<set>\n";
    
    $('.xml').each(function() {
        xml += "  <record>\n";
        
        // titles
        $(this).find('.title').each(function() {
            var lang = $(this).siblings("select").val();
            if ($(this).val().trim() != '') 
                xml += '    <title lang="'+lang+'">' + $(this).val() + '</title>\n';
        });
        // authors
        $(this).find('.author').each(function() {
            if ($(this).val().trim() != '') 
                xml += "    <author>" + $(this).val() + "</author>\n";
        });
        
        // descriptions
        $(this).find('.description').each(function() {
            var lang = $(this).siblings("select").val();
            if ($(this).val().trim() != '') 
                xml += '    <description lang="'+lang+'">' + $(this).val() + '</description>\n';
        });

        
        // depicted persons
        $(this).find('.depictedperson').each(function() {
            if ($(this).val().trim() != '')
                xml += "    <depicted_person>" + $(this).val() + "</depicted_person>\n";
        });

        // depicted places
        $(this).find('.depictedplace').each(function() {
            if ($(this).val().trim() != '')
                xml += "    <depicted_place>" + $(this).val() + "</depicted_place>\n";
        });

        xml += "    <keeper>" + $(this).find('.keeper').val() + "</keeper>\n";
        xml += "    <date>" + $(this).find('.date').val() + "</date>\n";
        xml += "    <permissions>" + $(this).find('.license').val() + "</permissions>\n";

        var imgurl = $(this).parents('table').find('.imgurl').val();
        imgurl = imgurl.replace(".jpg", "_o.jpg");  // we always upload original
        xml += "    <imgurl>"+imgurl+"</imgurl>\n";
        xml += "  </record>\n";
        
    });
    xml += "</set>";
    $("#xmlout").val(xml); 
}



function convertSet2WIKI(cont) {
    var xml = "";
    
    cont.parents("table").find('.xml').each(function() {
    
        xml += "{{Photograph\n";
        xml += "    |title = " + $(this).find('.title').val()+ "\n";
        
        // authors
        $(this).find('.author').each(function() {
            if ($(this).val().trim() != '') 
                xml += "    |photographer = " + $(this).val()+ "\n";
        });
        
        // descriptions
        $(this).find('.description').each(function() {
            if ($(this).val().trim() != '') {
                var langField = $(this).siblings("select").val();
                xml += "    |description = {{" + langField+"|1=" + $(this).val() + "}}\n";
            }
        });

        xml += listItems($(this), '.depictedperson', 'depicted people');
        xml += listItems($(this), '.depictedplace', 'depicted place');

        xml += "    |institution = " + $(this).find('.keeper').val() + "\n";
        xml += "    |date = " + $(this).find('.date').val() + "\n";
        //alert($(this).parent().get( 0 ).tagName);
        //var imgurl = $(this).parent('.tdurl').find('.imgurl')[0].val();
        //imgurl.replace("_s.jpg", "_c.jpg");
        //xml += "    <imgurl>https://farm4.staticflickr.com/3847/14148746009_0426de2b11_c.jpg</imgurl>\n";
        xml += "}}";
        
    });
    
    $("#xmlout").val(encodeURIComponent(xml)); 
    return encodeURIComponent(xml);
}


function listItems (cont, selectorClass, templateProperty) {

    var items = [];
    $(cont).find(selectorClass).each(function() {
        if ($(this).val().trim() != '')
            items.push($(this).val());
    });
    if (items.length != 0)
        return "    |" +templateProperty+ " = " + items.join(',') + "\n";
    else 
        return '';
}

