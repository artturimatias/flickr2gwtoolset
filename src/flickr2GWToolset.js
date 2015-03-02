
var ui_lang = "en";     // SET DEFAULT UI LANGUAGE HERE!   
var apikey = ""         // place for your Flickr API key

// GLOBALs
var wikipedia = "http://fi.wikipedia.org/wiki/"
var wikidata = "http://wikidata.org/wiki/"
var commons = "http://commons.wikimedia.org/wiki/";
var base = "http://commons.wikimedia.org/w/index.php?title=Special:ExpandTemplates&wpInput=";
var flickrSetURL = "https://api.flickr.com/services/rest/?method=flickr.photosets.getPhotos&photoset_id=";
var flickrUserURL = "https://api.flickr.com/services/rest/?method=flickr.people.getPhotos&user_id=";
var licenses={4: '{{Template:Cc-by-2.0}}',5:'{{Template:Cc-by-sa-2.0}}',7:'{{Template:Flickr-no_known_copyright_restrictions}}'};
var licensesPlain={4: 'Cc-by-2.0',5:'Cc-by-sa-2.0',7:'No known copyright restrictions'};
var cloneCount = 0;
var lang = {};
var xml = '';
var nodes = [];
var fields = ['accession_number', 'author', 'date','depicted_people','depicted_place', 'commons_title','description_fi','description_en', 'photographer', 'title_fi','title_en']
var ixml;

//onSaxonLoad = function() { 

	//var p = getParameter('file');
	
	//var xml = Saxon.requestXML("xml/"+p+".xml");
	//ixml = Saxon.parseXML(xml);
	//$("#xml").val(ixml);
	//alert(ixml);
//} 
 
$(document).ready(function(){

    lang = langs[ui_lang]; 

	//translate the whole thing!	
	for (var i in lang) {
		$('#' + i).html(lang[i]);
	}
    
    // set API key
    if (apikey != '')
        $("#apikey").val(apikey);

	//var p = getParameter('file');
    //var jqxhr = $.get( "xml/" + p + ".xml", function(data) {
    //})
      //.done(function(data) {
			//var d = $(data).find('source').text();
			//var xmlString = (new XMLSerializer()).serializeToString(data); // does not work on IE
			//$("#xml").val(xmlString);
			

      //})
      //.fail(function() {
        //alert( "ei onnistu" );
      //})
      //.always(function() {
      //});


	// generate field select options for tools
	$('#tools').find('select').each(function() {
		for (i=0; i < fields.length; i++) {
			$(this).append('<option>'+fields[i]+'</option>');
		}
	});

    // add click events
    $( "#all_set_date" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val($('#set_date').val());
        });
    });    

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
    $("#all_set_file_title").click(function() {
        generateTitles();
   	}); 
    	
    $("#fetch_by_album").click(function() {
        fetchImages(flickrSetURL + $("#setid").val() + '&api_key=');
   	});

    $("#fetch_by_user").click(function() {
        fetchImages(flickrUserURL + $("#userid").val() + '&api_key=');
   	});
    	 
    $("#toggle_all").click(function(c) {
        $('.holder').toggle();
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
    	
	$("#editXML").click(function() {
		transform();
	});
	
	$("#regex_test").click(function() {
		regexTest();
	});

	$("#regex_set").click(function() {
		regexSet();
	});
	
	$("#all_set_def_lang").click(function() {
		allSetLang();
	});
	
	$("#all_start_end_set").click(function() {
		allSetStartEnd();
	});

	$("#all_toggle_sel").click(function() {
		allToggleSel();
	});

	$("#all_select_all").click(function() {
		$('.enabled').each(function() {
			$(this).prop('checked', true);
		});
	});

	$("#keyval_set").click(function() {
		allKeyVal();
	});

	$("#all_inspect").click(function() {
		allInspect();
	});

	$("#all_inspect_clear").click(function() {
		$('#inspect_area').empty();
	});

});


function allInspect() {
	var field = $('#inspect_target').val();
	$('#inspect_area').html('<h2>'+field+'</h2>');
	$('.'+field).each(function() {
		var val = $(this).val().replace('\n','</br>')
		$('#inspect_area').append('<div class="inspect">' + val + '</div>')
	});
}

function allToggleSel() {
	$('.enabled').each(function() {
		$(this).trigger('click');
	});
}

function toggle(cont) {
	cont.parents('tr').next().find('.holder').toggle();
}


function getImageURLs(data) {
	
	i = 0;
	var from = parseInt($("#imgcount_from").val(), 10);
	var to = parseInt($("#imgcount_to").val(), 10);
	
	$(data).find("photo").each(function(index) {
		if (i >= to) { return }
		if (i >= from ) {
			var imgId = $(this).attr("id");
			nodes[imgId] = {};
			fetchURL(imgId);
			fetchInfo(imgId);
			
		}
		i = i + 1;
	});
}



function fetchImages(url) {

	$("#xml").val('');
	nodes = [];

    var setid = $("#setid").val();
    if ($("#apikey").val() == '') {
        alert(lang.set_api_key);
        return;
    }
    apikey =  $("#apikey").val().trim();

	var setti = {};
    var i = 0;
    var setid = $("#setid").val();
    var jqxhr = $.get( url + apikey, function(data) {	
    })
      .done(function(data) {
		 getImageURLs(data);
      })
      .fail(function() {
        alert( lang.query_error  );
      })
      .always(function() {
      });
     
}




function fetchURL(photoid) {

    var jqxhr = $.get( "https://api.flickr.com/services/rest/?method=flickr.photos.getSizes&api_key="+apikey+"&photo_id="+photoid, function(data) {
    })
      .done(function(data) {
			var d = $(data).find('size[label="Medium"]').attr("source");
			var large = $(data).find('size[label="Original"]').attr("source");
			nodes[photoid].imgurl = large;
			nodes[photoid].thumbnail = d;
      })
      .fail(function() {
        alert( lang.query_error  );
      })
      .always(function() {
      });
      
}


function fetchInfo(photoid, cont) {

    var jqxhr = $.get( "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key="+apikey+"&photo_id="+photoid, function(data) {
    })
  .done(function(data) {
	    $xml = $(data);
	    var license = $xml.find('photo').attr("license").trim();
	    if (license != '7' && license != '5' && license != '4') {
	        //nodes[photoid].append("<h2>" + $xml.find('title').text() + "</h2>"); 
	        //cont.find(".xml").append('<div class="license_alert">Non-free license! </div>'); 
	        return;
	    }

	    nodes[photoid].title = $xml.find('title').text(); 
	    nodes[photoid].permission = licensesPlain[license];
	    nodes[photoid].description = $xml.find("description").text(); 

	    nodes[photoid].username = $xml.find("owner").attr("username");
	    nodes[photoid].institution = $xml.find("owner").attr("realname"); 
	    nodes[photoid].date = $xml.find("dates").attr("taken"); 
	    
	    nodes[photoid].source = $xml.find("url").text(); 
        

    })
  .fail(function() {
        alert( lang_query_error );
  })
  .always(function() {
  });
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
        d.find("select")[0].selectedIndex = -1;	// TODO: fix this ugly thing
        //d.find("select option:selected").removeProp('selected');
        addAutocomplete(d.find("input.autocomplete"));
        var holder = $(this).parent().find(".frame");
        holder.append(d);
        addEvents(d);
    });


    cont.find( ".autocomplete" ).each(function(){

        addAutocomplete($(this));

    });

    cont.find( ".language_selection" ).on( "change", function(e) {
		var val = $(this).val();
		var attr = $(this).siblings().last().attr('name');
		attr = attr.replace(/_(..)$/,'') 	// remove old language
		attr = attr + '_' + $(this).val();	// add new
        $(this).siblings().last().attr('name',attr);
        $(this).siblings().last().attr('class',attr);
    })

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

	if($("#overwrite").is(':checked')) {
		$("#photos").find('.'+field).each(function() {
			$(this).val(replaceText); 
		});		
	} else {
		$("#photos").find('.'+field).each(function() {
			var text = $(this).val();
			$(this).val(text.replace(searchText, replaceText)); 
		});
	}

}

function convertSet() {
	
	var file_id = $('#file_id').text();
	var version = $('#version').text();
	version = parseInt(version) + 1;
	
    var xml = "<set>\n";
	
	$('.xml').each(function() {
		
		if ($(this).parents("tr").find(".enabled").prop('checked')) {
			xml += "  <record>\n";
		
			// loop all inputs
			$(this).find('input[type=text]').each(function() {
				
				var lang = $(this).siblings("select").val();
				var field = $(this).attr('name')
				field = field.replace(/_(..)$/,'') // remove language part (eg. title_en))
				
				if (lang != undefined) {
					xml += '    <'+field+' lang="'+lang+'">' + $(this).val().replace('&', '&amp;') + '</'+field+'>\n';				
				} else {
					xml += '    <'+field+'>' + $(this).val().replace('&', '&amp;') + '</'+field+'>\n';
				}
				
			});

			// description is a textarea
			$(this).find('textarea').each(function() {
				var lang = $(this).siblings("select").val();
				var field = $(this).attr('name')
				field = field.replace(/_(..)$/,'') // remove language part (eg. title_en))
				xml += '    <'+field+' lang="'+lang+'">' + $(this).val().replace('&', '&amp;') + '</'+field+'>\n';
			});
		
			// image link
			$(this).siblings('.info').find('img').each(function() {
				var field = $(this).attr('name')
				xml += '    <thumbnail>' + $(this).attr("src").replace('&', '&amp;') + '</thumbnail>\n';
			});

			xml += "  </record>\n";
		}
		
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
        xml += "    |source = " + $(this).find('.source').val() + "\n";
        xml += "}}";
        
    });
    
    $("#xmlout").val(encodeURIComponent(xml)); 
    return encodeURIComponent(xml);
}


function generateTitles() {

	var inputs = [];
	var prefixes = [];
	var postfixes = [];

	prefix = $("#file_title_prefix").val();
	postfix = $("#file_title_postfix").val();
	separator = $("#file_title1_default_sep").val();
	
	inputs.push($("#file_title1").val());
	inputs.push($("#file_title2").val());
	inputs.push($("#file_title3").val());

	prefixes.push($("#file_title1_prefix").val());
	prefixes.push($("#file_title2_prefix").val());
	prefixes.push($("#file_title3_prefix").val());

	postfixes.push($("#file_title1_postfix").val());
	postfixes.push($("#file_title2_postfix").val());
	postfixes.push($("#file_title3_postfix").val());

    $('.xml').each(function() {
		
		var output = [];
	
		for (i=0; i < inputs.length; i++) {
			var inputValues = [];
			$(this).find('.' + inputs[i]).each(function() {
				if ($(this).val().trim() != '') {
					// trim out curly braces and so on
					// dates
					var inputVal = $(this).val().trim();
					inputVal = inputVal.replace("{{other date|s|","");
					inputVal = inputVal.replace("}}","");
					inputValues.push(inputVal);
				}
				
			});
			
			if (inputValues.length > 0) {
				var intermed = prefixes[i] + inputValues.join(', ') + postfixes[i];
				output.push(intermed);

			}
		};
		//output.push(postfix);
		var out = prefix + output.join(separator) + postfix;
		$(this).find(".commons_title").val(out);
	
	});
}

function transform() {

	var template = $("#template_sel").val();

    var xsl = Saxon.requestXML("xsl/"+template+".xslt");
    var xml = Saxon.parseXML($("#xml").val());
    var proc = Saxon.newXSLT20Processor(xsl); 

    // set default language for text fields
    proc.setParameter(null, "def_lang", ui_lang);

    var x = proc.transformToFragment(xml,document);
    $("#photos").empty();
    $("#photos").append(x);
    
    $('.xml').each(function() {
		addEvents($(this));
	});
    
}




function regexTest() {
	var regexp = new RegExp($("#regex").val());
	var r = $("#regex").val();
	var source = $("#regex_source").val();
	$("#inspect_area").empty()
	
	$('.xml').each(function() {
			var sourceText = $(this).find("." + source).val();
			var findings = sourceText.match(regexp);

			console.log('-- regexp ----- ' + r)
			console.log(findings)
			if(findings) {
				// set value
				$("#inspect_area").append($('<div>' + findings[0] + '</div>'));
		}
	});
}

function regexSet() {
	var regexp = new RegExp($("#regex").val());
	var r = $("#regex").val();
	var source = $("#regex_source").val();
	var target = $("#regex_target").val();
	
	$('.xml').each(function() {
			var sourceText = $(this).find("." + source).val();
			var findings = sourceText.match(regexp);

			console.log('-- regexp ----- ' + r)
			console.log(findings)
			if(findings) {

				if ($("#regex_move").is(':checked')) {
					var replaced = sourceText.replace(findings[0], '');
					$(this).find("." + source).first().val(replaced.trim()); 
				}				

				if ($("#regex_add_field").is(':checked')) {
					var d = addInputField($(this).find("." + target).first());
					
					// set language of the new field
					var lang = $("#regex_new_lang").val();
					d.find('.language_selection').val(lang);
					
					// set value
					d.find('input, textarea').last().val(findings[0]);
					// move
					if ($("#regex_move").is(':checked')) {
						var replaced = sourceText.replace(findings[0], '');
						
						$(this).find("." + source).first().val(replaced.trim()); 
					}
				} else {
				
					if ($("#regex_append").is(':checked')) {
						var curr = $(this).find("." + target).val();
						$(this).find("." + target).val(curr + findings[0]);	
					} else {
						$(this).find("." + target).val(findings[0]);	
					}
				}
			}
			
	});
}



function addInputField(cont) {

	// clone first element in "input_holder"
	var newid = "cloned_" + (cloneCount++); // Generates a unique id
	var d = $(cont).parents(".input_holder").first().clone();
	d.find("input, textarea").val("");
	d.find("input").attr('id',newid);
	addAutocomplete(d.find("input.autocomplete"));
	var holder = $(cont).parents(".frame");
	holder.append(d);
	//addEvents(d);
	return d;
        
}


function tokenFind() {

	var r = $("#search_start").val();
	
}


function allSetLang () {

	var field = $("#all_def_lang").val();
	var defLang = $("#all_def_lang_sel").val();
	$('.'+field).each(function() {
		 $(this).siblings("select").val(defLang);
	});
	
}


function allSetStartEnd() {

	var field = $("#all_start_end_field").val();
	var start = $("#all_start").val();
	var end = $("#all_end").val();
	
	$('.'+field).each(function() {
		var val = $(this).val();
		val = start + val + end;
		$(this).val(val);
		
	});
	
}

// TODO: allows only one match
function allKeyVal() {
	
	var field = $("#keyval_source").val();
	var key = $("#keyval").val();
	var target = $("#keyval_target").val();
	
	$('.'+field).each(function() {
		var val = $(this).val();
		//val = start + val + end;
		//$(this).val(val);
		var lines = val.split("\n");
		for (i=0; i < lines.length; i++) {
			var match = lines[i].search(key);
			if (match != -1) {
				var pair = lines[i].substring(match + key.length, lines[i].length);
				$(this).parents(".xml").find('.'+target).val(pair.trim());
				console.log(pair);
				return;
			}
		}
		
		console.log(target);
		
	});
	
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


//Get querystring request paramter in javascript
function getParameter (parameterName ) {

   var queryString = window.top.location.search.substring(1);

   // Add "=" to the parameter name (i.e. parameterName=value)
   var parameterName = parameterName + "=";
   if ( queryString.length > 0 ) {
      // Find the beginning of the string
      begin = queryString.indexOf ( parameterName );
      // If the parameter name is not found, skip it, otherwise return the value
      if ( begin != -1 ) {
         // Add the length (integer) to the beginning
         begin += parameterName.length;
         // Multiple parameters are separated by the "&" sign
         end = queryString.indexOf ( "&" , begin );
      if ( end == -1 ) {
         end = queryString.length
      }
      // Return the string
      return unescape ( queryString.substring ( begin, end ) );
   }
   // Return "null" if no parameter has been found
   return null;
   }
}





$( document ).ajaxStop(function() {

	var xml = '<set>\n';
	var keys = Object.keys(nodes);

	for (i=0; i < keys.length ; i++) {
		xml += '  <record>\n';
		console.log(nodes[keys[i]].imgurl);
		var imgKeys = Object.keys(nodes[keys[i]])
		
		for (j=0; j < imgKeys.length; j++) {
			xml += '     <' + imgKeys[j] + '>' + nodes[keys[i]][imgKeys[j]]+ '</' + imgKeys[j] + '>\n';
		}
		xml += '  </record>\n';			
	}
	
	xml += '</set>\n';
	$("#xml").val(xml);
	//transform();
	

});
