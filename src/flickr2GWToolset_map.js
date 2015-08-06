
var ui_lang					= "en";     // SET DEFAULT UI LANGUAGE HERE!   
var proxy_photos_by_user 	= proxy + "proxy.php?command=flickr.people.getPhotos&user_id="
var proxy_photos_by_album 	= proxy + "proxy.php?command=flickr.photosets.getPhotos&photoset_id="
var proxy_photo_info 		= proxy + "proxy.php?command=flickr.photos.getInfo&photo_id="
var proxy_photo_url 		= proxy + "proxy.php?command=flickr.photos.getSizes&photo_id="


// GLOBALs
var wikipedia 		= "http://fi.wikipedia.org/wiki/"
var wikidata 		= "http://wikidata.org/wiki/"
var commons 		= "http://commons.wikimedia.org/wiki/";
var base 			= "http://commons.wikimedia.org/w/index.php?title=Special:ExpandTemplates&wpInput=";
var licenses		={4: '{{Template:Cc-by-2.0}}',5:'{{Template:Cc-by-sa-2.0}}',7:'{{Template:Flickr-no_known_copyright_restrictions}}'};
var licensesPlain	={4: 'Cc-by-2.0',5:'Cc-by-sa-2.0',7:'No known copyright restrictions'};
var cloneCount 		= 0;
var lang 			= {};
var xml 			= '';
var nodes 			= [];
var fields 			= ['accession_number', 'date','depicted_people','depicted_place', 'commons_title','institution','photographer']
var fields_lang     = ['description_fi','description_en','description_sv', 'title_fi','title_en','title_sv' ]
var fields_map 			= ['author','accession_number', 'date', 'commons_title','institution']
var templateName = "Photograph";

var ixml;

//onSaxonLoad = function() { 

	//var p = getParameter('file');
	
	//var xml = Saxon.requestXML("xml/"+p+".xml");
	//ixml = Saxon.parseXML(xml);
	//$("#xml").val(ixml);
	//alert(ixml);
//} 
 
$(document).ready(function(){

	// warn user about leaving page
	$(window).bind('beforeunload', function(){
	  return 'Are you sure you want to leave?';
	});

	$( "#tools" ).hide();
	$( "#editor" ).hide();
    lang = langs[ui_lang]; 

	//translate the whole thing!	
	for (var i in lang) {
		$('#' + i).html(lang[i]);
	}
    

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

	
	$('#tools').find('#all_def_lang').each(function() {
		for (i=0; i < fields_lang.length; i++) {
			$(this).append('<option>'+fields_lang[i]+'</option>');
		}
	});
	

    // add click event to tool buttons
    initToolButtons();


});


function allInspect() {
	
	var anchor_count = 1;
	$('.inspect_a').remove(); // remove previous anchors
	var field = $('#inspect_target').val();
	var sel_only = $("#inspect_selected_only").prop('checked');
	$('#inspect_area').html('<h2>'+field+'</h2>');
	
	$('.'+field).each(function() {
		var next = anchor_count + 1; 
		var prev = anchor_count - 1; 
		
		// if selected only is checked
		if (sel_only && !$(this).parents("tr").find(".enabled").prop('checked')) {
			return true
		}
		$(this).parents('.frame').find('.input_holder').prepend('<a class="inspect_a" name="field_'+anchor_count+'"/>');
		var nav = $('<div class="inspect_nav"></div>');
		nav.append(' <a class="inspect_back" href="#ins_'+anchor_count+'">back</a> | ');
		nav.append('<a class="inspect_prev" href="#field_'+prev+'"><-prev</a> | ');
		nav.append('<a class="inspect_next" href="#field_'+next+'">next-></a>');
		$(this).parent().parent().append(nav)
		var val = $(this).val().replace('\n','</br>')
		$('#inspect_area').append('<div><a name="ins_'+anchor_count+'"/><div class="inspect">' + anchor_count +'. '+ val + '</div> <a href="#field_'+anchor_count+'">[edit]</a></div>')
		anchor_count++;
	});
}

function clearInspect() {
	$("#inspect_area").empty();
	$('.inspect_a').remove();
	$('.inspect_nav').remove();
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

    // reset 
	$("#xml").val('');
	$("#your_xml").text('loading list of images...');
	nodes = [];

    var setid = $("#setid").val();
    var jqxhr = $.get( url, function(data) {	
    })
      .done(function(data) {
        $("#your_xml").text('loading list of images... getting details...');
		 getImageURLs(data);
      })
      .fail(function() {
        alert( lang.query_error  );
      })
      .always(function() {
      });
     
}




function fetchURL(photoid) {

    var jqxhr = $.get( proxy_photo_url + photoid, function(data) {
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

    var jqxhr = $.get( proxy_photo_info + photoid, function(data) {
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
	    nodes[photoid].permission = licenses[license];
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
    


    cont.find( ".autocomplete" ).each(function(){

        addAutocomplete($(this));

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
	
	//var file_id = $('#file_id').text();
	//var version = $('#version').text();
	//version = parseInt(version) + 1;
	
	var sel_only = $("#convert_selected_only").prop('checked');
	
	
    var xml = "<set>\n";
	
	$('.xml').each(function() {
		
		if ($(this).parents("tr").find(".enabled").prop('checked')) {
			xml += "  <record>\n";
		
			// loop all inputs
			$(this).find('input[type=text]').each(function() {
				
				if ($(this).val() == '') return;
				var lang = $(this).siblings(".language_selection").val();
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
				if ($(this).val() == '') return;
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
	
	
    var xml = "{{"+templateName+"\n";
	
		// loop all inputs
		cont.parent().find('input[type=text]').each(function() {
			
			var lang = $(this).siblings("select").val();
			var field = $(this).attr('name')
			field = field.replace(/_(..)$/,'') // remove language part (eg. title_en))
			
			if (lang != undefined) {
				xml += '    |'+field+' = ' + $(this).val() + '\n';				
			} else {
				xml += '    |'+field+' = ' + $(this).val() + '\n';	
			}
			
		});

		// description is a textarea
		cont.parent().find('textarea').each(function() {
			var lang = $(this).siblings("select").val();
			var field = $(this).attr('name')
			field = field.replace(/_(..)$/,'') // remove language part (eg. title_en))
			xml += '    |'+field+' = ' + $(this).val() + '\n';
		});
	
	
	xml += "}}";
	
	return encodeURIComponent(xml);
}



function generateTitles(test) {

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

	if(test === true) {
		clearInspect();
	}

    $('.xml').each(function() {
		
		var output = [];
	
		for (i=0; i < inputs.length; i++) {
			var inputValues = [];
			$(this).find('.' + inputs[i]).each(function() {
				if ($(this).val().trim() != '') {
					var inputVal = $(this).val().trim();
					// trim out wikicode from dates and institutions
					if (inputs[i] == 'date') {
						inputVal = inputVal.replace(/[^0-9.\-\:\.]/g,"");
						inputVal = inputVal.replace("}}","");
					} else if (inputs[i] == 'institution') {
						inputVal = inputVal.replace('{{Institution:',"");
						inputVal = inputVal.replace("}}","");
					} else {
						// remove wikipedia/wikidata links from input
						inputVal = inputVal.replace(/\[\[.:..:.*\|/,"");
						inputVal = inputVal.replace("]]","");
					}
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
		if(test === true) {
			$("#inspect_area").append($('<div>' + out + '</div>'));
		} else {
			$(this).find(".commons_title").val(out);
		}
	
	});
}



function transform() {

	var template = $("#template_sel").val();
	templateName = $("#template_sel option:selected").text();



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

function setToolOptins() {
	// let's read input names
	fields = [];
	$('.xml').first().find('input').each(function() {

		var inputName = $(this).prop('name');
		if (inputName.search(/_..$/) == -1) {
			fields.push($(this).prop('name'))
		} 
	});
	fields.sort()
	// generate field select options for tools
	$('#tools').find('select').not('#all_def_lang, #all_def_lang_sel, #add_link_pedia, #add_link_pedia_lang').each(function() {
		for (i=0; i < fields.length; i++) {
			$(this).append('<option>'+fields[i]+'</option>');
		}
		$(this).append('<option class="select-dash" disabled="disabled">----</option>');
		for (i=0; i < fields_lang.length; i++) {
			$(this).append('<option>'+fields_lang[i]+'</option>');
		}
	});
}


function regexTest() {
	clearInspect();
	var regexp = new RegExp($("#regex").val());
	var r = $("#regex").val();
	var source = $("#regex_source").val();
	var sel_only = $("#regex_selected_only").prop('checked');
	
	$('.xml').each(function() {
			// skip if "selected only" is selected and image is not 
			if (sel_only && !$(this).parents("tr").find(".enabled").prop('checked')) {
				return true
			}
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


function regexSelect() {
	var regexp = new RegExp($("#regex_sel").val());
	var source = $("#regex_sel_source").val();
	
	$('.xml').each(function() {
			var sourceText = $(this).find("." + source).val();
			var findings = sourceText.match(regexp);
			if(findings) {
				$(this).parents("tr").find(".enabled").prop('checked', true)
			} else {
				$(this).parents("tr").find(".enabled").prop('checked', false)
			}
	});
}



function regexSet() {
	var regexp = new RegExp($("#regex").val());
	var r = $("#regex").val();
	var source = $("#regex_source").val();
	var target = $("#regex_target").val();
	var sel_only = $("#regex_selected_only").prop('checked');
	
	// multilang inputs needs special attention
	var multilang = false;
	if (target.search(/_..$/) != -1) {
		multilang = true;
	} 
	
	$('.xml').each(function() {

			
			if ($(this).find("." + source).length == 0)
				return
			var sourceText = $(this).find("." + source).val();
			var findings = sourceText.match(regexp);

			//console.log('-- regexp ----- ' + r)
			//console.log(findings)
			if(findings) {

				
				var targetInput = $(this).find("." + target).first()
				
                // If multilang entry is not found-> try to create it
			    if ($(this).find("." + target).length == 0 && multilang) {
					
			        var splitted = target.split('_');
			        var flang = splitted[1];
			        var fname = splitted[0];
			        if ($(this).find("[class^='"+fname+"']").length != 0) {
				        var d = addInputField($(this).find("[class^='"+fname+"']").first());
				        // set language of the new field
				        d.find('.language_selection').val(flang).change();
				        targetInput = d.find('input, textarea').last();
				    } else {
				        console.log('Could not create ' + target + '!');
				    }
				    
				 // if target is found and it can have multiple values, then add input 
				} else {
					if ($(this).find("." + target).parents(".holder").find(".addinput").length != 0 && !multilang) {
						// if last input is empty, use it instead of creating new (eg. in first run)
						var lastInput = $(this).find("." + target).last()
						if ( lastInput.val() == '') {
							targetInput = lastInput
						} else {
							var d = addInputField($(this).find("." + target).first());
							targetInput = d.find('input, textarea').last();
						}
						
					}
				}

                // cut if selected
				if ($("#regex_move").is(':checked')) {
					var replaced = sourceText.replace(findings[0], '');
					$(this).find("." + source).first().val(replaced.trim()); 
				}

				// set value (append or set)
				if ($("#regex_append").is(':checked')) {
					var curr = $(this).find("." + target).val();
					targetInput.val(curr + findings[0]);	
				} else {
					targetInput.val(findings[0]);	
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
		 $(this).siblings("select").val(defLang).change();
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



function setOtherDate(dateinput, other_type) {
	
	var cleandate = dateinput.val().replace(/[^0-9.\-\:]/g,"");
	
	switch (other_type) {
		case 'no_other_date': 
			dateinput.val(cleandate);
			break;
		case 'after':
			dateinput.val('{{other date|>|' + cleandate + '}}');
			break;
		case 'before':
			dateinput.val('{{other date|<|' + cleandate + '}}');
			break;
		case 'circa':
			dateinput.val('{{other date|~|' + cleandate + '}}');
			break;
		case 'decade':
			dateinput.val('{{other date|s|' + cleandate + '}}');
			break;
		case 'century':
			dateinput.val('{{other date|century|' + cleandate + '}}');
			break;
	}		
}


function reverseDates(sep) {
	$('.xml').each(function() {
		
		if ($(this).parents("tr").find(".enabled").prop('checked')) {
			var input = $(this).find(".date");
			if (sep == '')
				return;
				
			var splitted = input.val().trim().split(sep);
			splitted.reverse()
			var out = splitted.join('-');
			input.val(out);
		}
	});
}

function addLinks(test) {
	var source = $('#add_link_source').val();
	var regexp = new RegExp($('#add_link_regexp').val());
	var linktext = $('#add_link_link').val();
	// wikipedia
	if($('#add_link_pedia').val() == 'wikipedia') {
		linktext = '[[w:' + $('#add_link_pedia_lang').val() + ':' + linktext + '|'; 
	// wikidata
	} else {
		linktext = '[[d:' + linktext + '|'; 
	}
	
	$('.xml').each(function() {
		
		if ($(this).parents("tr").find(".enabled").prop('checked')) {
			
			var input = $(this).find("." + source);
			var sourceText = input.val();
			
			var findings = sourceText.match(regexp);
			if (findings) {
			
				var link = linktext + findings[0] + ']]';
				sourceText = sourceText.replace(regexp,link)
				if (!test) {
					input.val(sourceText);
				} else {
					$("#inspect_area").append($('<div>' + sourceText + '</div>'));
				}
			}
		}
		
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
	$("#your_xml").text('Your XML is ready!');
	$("#xml").val(xml);
	//transform();
	

});
