
function initToolButtons() {

    $(document).on( "change", ".language_selection", function(e) {
		var val = $(this).val();
		var attr = $(this).siblings().last().attr('name');
		attr = attr.replace(/_(..)$/,'') 	// remove old language
		attr = attr + '_' + $(this).val();	// add new
        $(this).siblings().last().attr('name',attr);
        $(this).siblings().last().attr('class',attr);
    })

    $(document).on( "click", ".addinput", function(e) {
        // clone first element in "input_holder"
        var newid = "cloned_" + (cloneCount++); // Generates a unique id
        var d = $(this).parent().find(".input_holder").first().clone();
        d.find("input").val("");
        d.find("input").attr('id',newid);
        if(d.find("select").length) {
			d.find("select")[0].selectedIndex = -1;	// TODO: fix this ugly thing
		}
        //d.find("select option:selected").removeProp('selected');
        addAutocomplete(d.find("input.autocomplete"));
        var holder = $(this).parent().find(".frame");
        holder.append(d);
        //addEvents(d);
    });

	// back button in inspected elements
    $(document).on( "click", ".inspect_back", function(e) {
		if ($(this).parent().parent().find('input').length != 0) {
			var val = $(this).parent().parent().find('input').val();
		} else {
			var val = $(this).parent().parent().find('textarea').val();
		}
		var anchor_count = $(this).prop('href').split('#')[1].split('_')[1];
		$('a[name=ins_'+anchor_count+']').parent().find('.inspect').html(anchor_count+'. <span class="ed">'+val+'</span>');
	});

	// back button in inspected elements
    $(document).on( "change", ".other_date_select", function(e) {
		
		var other_type = $(this).find(":selected").attr('name');
		var dateinput = $(this).parent().find('.date').first();
		setOtherDate(dateinput, other_type)
		
	});



	
    // add click events
    $( "#all_remove_time" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val(removeTime($(this).val()));
        });
    });

    $( "#all_reverse_date" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val(removeTime($(this).val()));
        });
    });
    
    $( "#all_leave_year" ).on( "click", function(e) {
        $(".date").each(function() {
            $(this).val(leaveYear($(this).val()));
        });
    });


	// buttons
	
    $("#all_reverse_date").click(function() {
        reverseDates($('#reverse_date_sep').val());
   	}); 
	
    $("#all_set_file_title").click(function() {
        generateTitles(false);
   	}); 

    $("#all_set_file_title_test").click(function() {
        generateTitles(true);
   	}); 
    	
    $("#fetch_by_album").click(function() {
        fetchImages(proxy_photos_by_album + $("#setid").val());
   	});

    $("#fetch_by_user").click(function() {
        fetchImages(proxy_photos_by_user + $("#userid").val());
   	});
    	 
    $("#toggle_all").click(function(c) {
        $('.holder').toggle();
   	});

    $("#replace").click(function() {
        searchAndReplace();
   	});

    $("#add_links").click(function() {
        addLinks(false);
   	});

    $("#add_links_test").click(function() {
        addLinks(true);
   	});
    	
    $("#convert").click(function() {
        convertSet();
    }); 
    	
    $("#convertWIKI").click(function() {
        convertSet2WIKI();
    }); 
    	
	$("#editXML").click(function() {
		transform();
		setToolOptins();
		$( "#tools" ).show();
		$( "#editor" ).show();
	});
	
	$("#regex_test").click(function() {
		regexTest();
	});

	$("#regex_set").click(function() {
		regexSet();
	});

	$("#regex_sel_set").click(function() {
		regexSelect();
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
		clearInspect();
		allInspect();
	});

	$("#all_inspect_clear").click(function() {
		clearInspect();
	});
	
}
