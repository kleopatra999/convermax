//alert('asd');

var cm_params = {
    facets: {},
    page: '',//1,//cm_page,
    size: '',//cm_size,
    //sort: '',
    //sort_desc: false,
    orderby: 'position',
    orderway: 'desc',
    //query: cm_query,
    SetFacet: function(checked, fieldname, value) {
        //value = value.split('|');
        //key = value[0];
        if(checked) {
            //working code:
            //this.facets.push({key: fieldname, val: value});
            if(!this.facets[fieldname]) {
                //this.facets.push(fieldname);
                this.facets[fieldname] = [];
            }
            this.facets[fieldname].push(value);
            //this.facets[].({key: value[0], val: value[1]});
        } else {
            //working code:
            /*for (var i = 0; i < this.facets.length; i++) {
                if(this.facets[i]['key'] == fieldname && this.facets[i]['val'] == value) {
                    //delete this.facets[i];
                    this.facets.splice(i,1);
                }
            }*/
            for (var i = 0; i < this.facets[fieldname].length; i++) {
                if(this.facets[fieldname][i] == value) {
                    this.facets[fieldname].splice(i,1);
                }
            }
            if (this.facets[fieldname].length == 0) {
                //this.facets.splice(this.facets.indexOf(fieldname), 1);
                delete this.facets[fieldname];
            }
        }
    },
    Get: function() {
        var data = '';
        for (var i = 0; i < this.facets.length; i++) {
            data += 'fld' + i + '=' + this.facets[i]['key'] + '&val' + i + '=' + this.facets[i]['val'] + (i == (this.facets.length - 1) ? '' : '&');
        }
        return data;
    },
    GetFacets_old_working: function(format) {
        var data = '';
        var keys = Object.keys(this.facets);
        for(var i = 0; i < keys.length; i++ ) {
            //console.log(this.facets[keys[i]]);
            if (format == 'url') {
                data += '&facet.' + i + '.field=' + encodeURIComponent(keys[i]);
            }
            for(var j = 0; j < this.facets[keys[i]].length; j++ ) {
                if (format == 'url') {
                    data += '&facet.' + i + '.selection=' + encodeURIComponent(this.facets[keys[i]][j]);
                }
                if (format == 'list') {
                    data += '<li>' + keys[i] + ' - ' + this.facets[keys[i]][j] + '<span onclick="cm_params.SetFacet(false, \'' + keys[i] + '\', \'' + this.facets[keys[i]][j] + '\');cm_reload()">[x]</span></li>';
                }
            }

        }
        return data;
    },
    GetFacets: function(format) {
        var data = '';
        var keys = Object.keys(this.facets);
        for(var i = 0; i < keys.length; i++ ) {
            //console.log(this.facets[keys[i]]);
            if (format == 'url') {
                //data += '&' + encodeURIComponent(keys[i]) + '[]=';
            }
            for(var j = 0; j < this.facets[keys[i]].length; j++ ) {
                if (format == 'url') {
                    //data += '&facet.' + i + '.selection=' + encodeURIComponent(this.facets[keys[i]][j]);
                    data += (i == 0 ? '' : '&') + 'cm_select[' + encodeURIComponent(keys[i]) + '][]=' + encodeURIComponent(this.facets[keys[i]][j]);
                }
                if (format == 'list') {
                    data += '<li>' + keys[i] + ' - ' + this.facets[keys[i]][j] + '<span onclick="cm_params.SetFacet(false, \'' + keys[i] + '\', \'' + this.facets[keys[i]][j] + '\');cm_reload();">[x]</span></li>';
                }
            }

        }
        return data;
    }
};
var ajaxLoaderOn = 0;
//cm_params.facets.push({key: fieldname, val: value});



$(document).ready(function()
{
    //$('#cm_selected_facets').replaceWith('<div id="cm_selected_facets">asd<ul>' + cm_params.GetFacets('list') + '</ul></div>');

    //cm_params.size = cm_size;
    //alert(cm_size);

    if (typeof redirect_url != 'undefined' && redirect_url) {
        window.location = redirect_url;
        //alert(redirect_url);
    }

    $('#cm_facets').on('change', 'input[type=checkbox]', function()
    {
        //alert(this.checked);
        //reloadContent();
        //console.log(cm_params.facets);

        cm_params.SetFacet(this.checked, this.dataset.fieldname, this.value);
        //console.log(cm_params.facets);
        cm_params.page = 1;
        cm_reload();
    });
    /*if (window.location.href.split('#').length == 2 && window.location.href.split('#')[1] != '')
    {
        var params = window.location.href.split('#')[1];
        //alert(params);
        cm_reload();
    }*/

    //$('select[name=n]').off('change')
    //$('.nbrItemPage').off('change').on('change', 'select[name=n]', function(e)
    //$('select[name=n]').on('change', 'select[name=n]', function(e)
    //$('select[name=n]').off('change').on('change', function(event) {
    //$(document).off('change').on('change', 'select[name=n]', function(e) {
    //$('select[name=n]').off('change');
    $(document).off('change', 'select[name="n"]');
    //$('select[name=n]').on('change', function(e) {
    $(document).on('change', 'select[name=n]', function(e) {
        //alert('name=n');
        $('select[name=n]').val($(this).val());
        cm_params.size = $(this).val();
        cm_params.page = 1;
        cm_reload();
    });

    $('#cm_related a').click(function(e) {
        e.preventDefault();
        cm_params.page = 1;
        cm_query = $(this).text();
        //cm_reload({page: p});
        //alert(cm_query);
        cm_reload();
    });


    //$('.productsSortForm').off('change').on('change', '.selectProductSort', function(e){
    //$('.selectProductSort').off('change').on('change', function(event) {
    //$('.selectProductSort').off('change');
    //$(document).off('change', '.selectProductSort');
    //$('.selectProductSort').unbind('change').bind('change', function(event) {
    //$(document).off('change').on('change', '.selectProductSort', function(e) {
    $(document).off('change', '.selectProductSort');
    $(document).on('change', '.selectProductSort', function(e) {
        //alert('selectProductSort');
        /*
        if (typeof request != 'undefined' && request)
            var requestSortProducts = request;
        var splitData = $(this).val().split(':');
        if (typeof requestSortProducts != 'undefined' && requestSortProducts)
            document.location.href = requestSortProducts + ((requestSortProducts.indexOf('?') < 0) ? '?' : '&') + 'orderby=' + splitData[0] + '&orderway=' + splitData[1];
        */
        var splitData = $(this).val().split(':');
        /*
        if (splitData[0] != 'position') {
            cm_params.orderby = splitData[0];
            if (splitData[1] = 'desc') {
                cm_params.sort_desc = true;
            }
        }*/

        cm_params.orderby = splitData[0];
        cm_params.orderway = splitData[1];
        cm_params.page = 1;

        console.log(cm_params.orderby);
        console.log(cm_params.orderway);

        cm_reload();
    });


    cm_paginationButton();
    //cm_init();
    cm_displayCurrentSearchBlock();

    //autocomplete part
    $("#search_query_" + blocksearch_type).unautocomplete();//.attr("autocomplete", "off");

    var width_ac_results = 	$("#search_query_" + blocksearch_type).parent('form').width();
    if (typeof ajaxsearch != 'undefined' && ajaxsearch && typeof blocksearch_type !== 'undefined' && blocksearch_type)
        $("#search_query_" + blocksearch_type).autocomplete(
            search_url,
            {
                minChars: 3,
                max: 10,
                width: (width_ac_results > 0 ? width_ac_results : 500),
                selectFirst: false,
                scroll: false,
                dataType: "json",
                formatItem: function(data, i, max, value, term) {
                    //return value + i;
                    if (value == 'freetext') {
                        return data.Text;
                    }
                    if (value == 'product') {
                        return '<img src="' + data.img_link + '"><p>' + data.description_short + '</p>';
                    }
                    if (value == 'category') {
                        return data.FacetValue;
                    }
                },
                parse: function(data) {
                    var mytab = new Array();
                    for (var i = 0; i < data.length; i++)
                        //mytab[mytab.length] = { data: data[i], value: data[i].cname + ' > ' + data[i].pname };
                        mytab[mytab.length] = { data: data[i], value: data[i].Type };
                        //mytab[mytab.length] = { data: data[i], value: data[i] };
                    return mytab;
                    //return data;
                },
                extraParams: {
                    ajaxSearch: 1,
                    id_lang: id_lang
                }
            }
        )
            .result(function(event, data, formatted) {
                //$('#search_query_' + blocksearch_type).val(data.name);
                //document.location.href = data.product_link;
                //document.location.href = search_url + ((search_url.indexOf('?') < 0) ? '?' : '&') + request
                if (data.Type == 'freetext') {
                    //return data.Text;
                    //$('#search_query_' + blocksearch_type).val(data.Text);
                    document.location.href = search_url + ((search_url.indexOf('?') < 0) ? '?' : '&') + 'search_query=' + data.Text;
                }
                if (data.Type == 'product') {
                    //return '<img src="' + data.img_link + '"><p>' + data.description_short + '</p>';
                    //$('#search_query_' + blocksearch_type).val(data.name);
                    document.location.href = data.link;
                }
                if (data.Type == 'category') {
                    //return '<img src="' + data.img_link + '"><p>' + data.description_short + '</p>';
                    //$('#search_query_' + blocksearch_type).val(data.name);
                    cm_params.SetFacet(true, data.FieldName, data.FacetValue);
                    //document.location.href = search_url + ((search_url.indexOf('?') < 0) ? '?' : '&') + 'search_query=' + data.FacetValue + '&' + cm_params.GetFacets('url');
                    document.location.href = search_url + ((search_url.indexOf('?') < 0) ? '?' : '&') + cm_params.GetFacets('url');
                }
            });


});

/*
$(function() {
    $("#search_query_" + blocksearch_type).unautocomplete().attr("autocomplete", "off");

    $.widget("custom.catcomplete", $.ui.cm_autocomplete, {
        _create: function () {
            this._super();
            this.widget().menu("option", "items", "> :not(.suggestion-category)");
        },
        _renderMenu: function (ul, items) {
            ul.addClass("suggestion-items");
            if (this.option("additionalCssClass") != undefined) {
                ul.addClass(this.option("additionalCssClass"));
            }
            var that = this;
            var currentCategory = "";
            $.each(items, function (index, item) {
                if ((item.Type + "_" + item.SuggestionGroup) != currentCategory) {
                    if (item.Type != "freetext") {
                        ul.append("<li class='suggestion-category'>" + item.SuggestionGroup + "</li>");
                    }
                    currentCategory = item.Type + "_" + item.SuggestionGroup;
                }
                var li = that._renderItemData(ul, item);
            });
        },
        _renderItem: function (ul, item) {
            var li = $("<li>");
            if (item.Type == "freetext") {
                li.addClass('freetext').append("<a>" + item.TextHighlight + "</a>");
            } else if (item.Type == "product") {
                li.addClass('product').append(
                    "<div class='imgblock'>" +
                    "<img class='product-thumb' src='" + item.img_link + "' /> </div>" +
                    "<a class='product-link' href='" + item.link + "'>" + item.Name + "</a>" +
                    "<div class='product-descr'>" + item.description_short + "</div>" +
                    "<div class='product-price" + (item.OnSale == "Yes" ? " onsale" : "") + "'>" + (item.OnSale == "Yes" ? "On Sale: " : "Your Price: ") + "$" + item.CurrentPrice + "</div>"
                );
            } else { // category suggestions
                li.addClass('cat1').append("<a>" + item.HighlightedValue + "</a>");
            }
            return li.appendTo(ul);
        }
    });

    var autocompleteSearchboxes = $("#search_query_" + blocksearch_type).catcomplete({
        source: autocompleterequest,
        minLength: 2,
        focus: function (event, ui) {
            if (ui.item.Type == "freetext") {
                $(this).val(ui.item.Text);
            } else {
                $(this).val("");
            }
            return false;
        },
        select: function (event, ui) {
            if (ui.item.Type == "freetext") {
                $(this).val(ui.item.Text);
                fireFromAutocomplete();
            } else if (ui.item.Type == "product") {
                window.location.replace(ui.item.ProductLink);
            } else { // category suggestions
                cmSettings.query = "";
                $(cmSettings.selectors.querybox_searchPage + ", " + cmSettings.selectors.querybox_allPages).val("");
                fireFromAutocomplete({
                    Field: ui.item.FieldName,
                    Selection: ui.item.FacetValue
                });
            }
            return false;
        }
    });
    //$("#search_query_" + blocksearch_type).catcomplete();
});

function autocompleterequest(request, response) {

    //fillPreselectedAdditions();

    //if (cmSettings.globals.searchinprogress) {
    //    return;
    //}
    var req = $.ajax({
        url: cm_autocomplete_url,
        dataType: "json",
        data: 'query=' + request.term,
        success: function (data) {
            //if (cmSettings.globals.searchinprogress) {
            //    return;
            //}
            response(data);
        }
    });
    //cmSettings.globals.autocmpltreqs.push(req);
};*/


function cm_displayCurrentSearchBlock() {
    if(!Object.keys(cm_params.facets).length) {
        $('#cm_selected_facets').replaceWith('<div id="cm_selected_facets"> </div>');
    } else {
        var data;
        data = '<b>Current Search</b>';
        data += '<ul>';
        data += cm_params.GetFacets('list');
        data += '<li><span onclick="cm_params.facets = {};cm_reload();">clear all</span></li>';
        data += '</ul>';

        //return data;
        $('#cm_selected_facets').replaceWith('<div id="cm_selected_facets">' + data + '</div>');
    }
}


jQuery.fn.center = function () {
    this.css("position","fixed");
    this.css("top", Math.max(0, ((this.parent().height() - $(this).outerHeight()) / 2) +
    this.parent().scrollTop()) + "px");
    this.css("left", Math.max(0, (($(this.parent()).width() - $(this).outerWidth()) / 2) +
    this.parent().scrollLeft()) + "px");
    return this;
}

function cm_reload(params) {
    console.log(cm_params.facets);
    if (!ajaxLoaderOn)
    {
        $('#center_column').prepend($('#cm_ajax_container').html());
        //$('.cm_ajax_message').center();
        /*$('.cm_ajax_message').css("position","fixed");
        $('.cm_ajax_message').css('z-index', '9');
        $('.cm_ajax_message').css('top', '50%');
        $('.cm_ajax_message').css('left', '50%');*/
        //$('#cm_ajax_loader').css('margin', '0 auto');
        //$('.cm_ajax_message').css({top:'50%',left:'50%',margin:'-'+($('.cm_ajax_message').height() / 2)+'px 0 0 -'+($('.cm_ajax_message').width() / 2)+'px'});
        $('#center_column').css('opacity', '0.7');
        ajaxLoaderOn = 1;
    }
    /*var facets = params.facets || cm_params.Getfacets();
    var page = params.page || cm_page;
    var size = params.size || cm_size;*/

    //var request = encodeURIComponent(cm_params.GetFacets('url')) + '&p=' + cm_params.page + '&n=' + cm_params.size + '&search_query=' + cm_query;
    var request = cm_params.GetFacets('url') + '&p=' + cm_params.page + '&n=' + cm_params.size + '&search_query=' + cm_query;
    if (cm_params.orderby) {
        request += '&orderby=' + encodeURIComponent(cm_params.orderby) + '&orderway=' + cm_params.orderway;

        /*if (cm_params.sort_desc) {
            request += '&sort.0.descending=true';
        }*/
    }

    var loc = search_url + ((search_url.indexOf('?') < 0) ? '?' : '&') + request;


    //cm_stopAjaxQuery();
    console.log(request);
    cm_ajaxQuery = $.ajax(
        {
            type: 'GET',
            url: baseDir + 'modules/convermax/convermax-ajax.php',
            //data: 'facets=' + JSON.stringify(cm_params.facets) + '&cm_query=' + cm_query,
            data: request,
            dataType: 'json',
            success: function(result)
            {


                console.log('cm_reload ajax success');

                if (typeof result.redirect_url != 'undefined' && result.redirect_url) {
                    window.location = result.redirect_url;
                    return;
                    //alert(redirect_url);
                }

                //qw = result;
                //console.log(result.facets);
                //alert(result.facets);
                //$('#cm_selected_facets').replaceWith('<div id="cm_selected_facets">' + cm_displayCurrentSearchBlock() + '</div>');
                cm_displayCurrentSearchBlock();
                $('#facets_block').replaceWith('<div id="facets_block">' + result.facets + '</div>');

                //update checkboxes style
                //$('#facets_block').find('input:checkbox').uniform();


                $('#center_column').attr('id', 'old_center_column');
                $('#old_center_column').replaceWith('<div id="center_column" class="' + $('#old_center_column').attr('class') + '">'+result.productList+'</div>');
                $('#old_center_column').hide();


                $('#center_column').attr('id', 'old_center_column');
                $('#old_center_column').replaceWith('<div id="center_column" class="' + $('#old_center_column').attr('class') + '">'+result.productList+'</div>');
                $('#old_center_column').hide();




                cm_paginationButton();
                initUniform();
                ajaxLoaderOn = 0;


                $('div.pagination form').on('submit', function(e)
                {
                    e.preventDefault();
                    val = $('div.pagination select[name=n]').val();

                    $('div.pagination select[name=n]').children().each(function(it, option) {
                        if (option.value == val)
                            $(option).attr('selected', true);
                        else
                            $(option).removeAttr('selected');
                    });

                    // Reload products and pagination
                    alert('div.pagination form');
                    cm_reload();
                });

                if (display instanceof Function) {
                    var view = $.totalStorage('display');

                    //if (view && view != 'grid')
                        display(view);
                }

                history.pushState(null, '', loc);
                //console.log(loc);
                //alert(loc);


            },
            error: function (r) {
                /*var r = jQuery.parseJSON(response.responseText);
                alert("Message: " + r.Message);
                alert("StackTrace: " + r.StackTrace);
                alert("ExceptionType: " + r.ExceptionType);*/
                alert(r.responseText);
            }
        });
    //cm_ajaxQueries.push(cm_ajaxQuery);
    console.log('cm_reload end');
}

function cm_init()
{

}



function cm_paginationButton() {
    var current_friendly_url = '#';
    $('.pagination a').not(':hidden').each(function () {
        if ($(this).attr('href').search(/[&|\?]p=/) == -1)
            var page = 1;
        else
            var page = $(this).attr('href').replace(/^.*[&|\?]p=(\d+).*$/, '$1');

        //var location = window.location.href.replace(/#.*$/, '');
        //$(this).attr('href', location+current_friendly_url.replace(/\/page-(\d+)/, '')+'/page-'+page);
    });
    $('.pagination li').not('.current, .disabled').each(function () {
        var nbPage = 0;
        if ($(this).attr('class') == 'pagination_next')
            nbPage = parseInt($('.pagination li.current').children().children().html())+ 1;
        else if ($(this).attr('class') == 'pagination_previous')
            nbPage = parseInt($('.pagination li.current').children().children().html())- 1;

        $(this).children().children().on('click', function(e) {
            e.preventDefault();
            if (nbPage == 0)
                p = parseInt($(this).html()) + parseInt(nbPage);
            else
                p = nbPage;
            //p = '&p='+ p;
            cm_params.page = p;
            //cm_reload({page: p});
            cm_reload();
            nbPage = 0;
            return false;
        });
    });
}

function cm_stopAjaxQuery() {
    if (typeof(cm_ajaxQueries) == 'undefined')
        cm_ajaxQueries = new Array();
    for(i = 0; i < cm_ajaxQueries.length; i++) {
        if (typeof cm_ajaxQueries[i] != 'undefined')
            cm_ajaxQueries[i].abort();
    }
    cm_ajaxQueries = new Array();
}


function initUniform()
{
    $("#cm_facets input[type='checkbox'], select.form-control").uniform();
}

function utf8_decode (utfstr) {
    var res = '';
    for (var i = 0; i < utfstr.length;) {
        var c = utfstr.charCodeAt(i);

        if (c < 128)
        {
            res += String.fromCharCode(c);
            i++;
        }
        else if((c > 191) && (c < 224))
        {
            var c1 = utfstr.charCodeAt(i+1);
            res += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
            i += 2;
        }
        else
        {
            var c1 = utfstr.charCodeAt(i+1);
            var c2 = utfstr.charCodeAt(i+2);
            res += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
            i += 3;
        }
    }
    return res;
}


//core

/*! jQuery UI - v1.10.3 - 2013-05-03
 * http://jqueryui.com
 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function(e,t){function i(t,i){var a,n,r,o=t.nodeName.toLowerCase();return"area"===o?(a=t.parentNode,n=a.name,t.href&&n&&"map"===a.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&s(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&s(t)}function s(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var a=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,s){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),s&&s.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var s,a,n=e(this[0]);n.length&&n[0]!==document;){if(s=n.css("position"),("absolute"===s||"relative"===s||"fixed"===s)&&(a=parseInt(n.css("zIndex"),10),!isNaN(a)&&0!==a))return a;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++a)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,s){return!!e.data(t,s[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var s=e.attr(t,"tabindex"),a=isNaN(s);return(a||s>=0)&&i(t,!a)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,s){function a(t,i,s,a){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,s&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),a&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===s?["Left","Right"]:["Top","Bottom"],r=s.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+s]=function(i){return i===t?o["inner"+s].call(this):this.each(function(){e(this).css(r,a(this,i)+"px")})},e.fn["outer"+s]=function(t,i){return"number"!=typeof t?o["outer"+s].call(this,t):this.each(function(){e(this).css(r,a(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,s){var a,n=e.ui[t].prototype;for(a in s)n.plugins[a]=n.plugins[a]||[],n.plugins[a].push([i,s[a]])},call:function(e,t,i){var s,a=e.plugins[t];if(a&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(s=0;a.length>s;s++)e.options[a[s][0]]&&a[s][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var s=i&&"left"===i?"scrollLeft":"scrollTop",a=!1;return t[s]>0?!0:(t[s]=1,a=t[s]>0,t[s]=0,a)}})})(jQuery);




//widget

/*! jQuery UI - v1.10.3 - 2013-05-03
 * http://jqueryui.com
 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function(e,t){var i=0,s=Array.prototype.slice,n=e.cleanData;e.cleanData=function(t){for(var i,s=0;null!=(i=t[s]);s++)try{e(i).triggerHandler("remove")}catch(a){}n(t)},e.widget=function(i,s,n){var a,r,o,h,l={},u=i.split(".")[0];i=i.split(".")[1],a=u+"-"+i,n||(n=s,s=e.Widget),e.expr[":"][a.toLowerCase()]=function(t){return!!e.data(t,a)},e[u]=e[u]||{},r=e[u][i],o=e[u][i]=function(e,i){return this._createWidget?(arguments.length&&this._createWidget(e,i),t):new o(e,i)},e.extend(o,r,{version:n.version,_proto:e.extend({},n),_childConstructors:[]}),h=new s,h.options=e.widget.extend({},h.options),e.each(n,function(i,n){return e.isFunction(n)?(l[i]=function(){var e=function(){return s.prototype[i].apply(this,arguments)},t=function(e){return s.prototype[i].apply(this,e)};return function(){var i,s=this._super,a=this._superApply;return this._super=e,this._superApply=t,i=n.apply(this,arguments),this._super=s,this._superApply=a,i}}(),t):(l[i]=n,t)}),o.prototype=e.widget.extend(h,{widgetEventPrefix:r?h.widgetEventPrefix:i},l,{constructor:o,namespace:u,widgetName:i,widgetFullName:a}),r?(e.each(r._childConstructors,function(t,i){var s=i.prototype;e.widget(s.namespace+"."+s.widgetName,o,i._proto)}),delete r._childConstructors):s._childConstructors.push(o),e.widget.bridge(i,o)},e.widget.extend=function(i){for(var n,a,r=s.call(arguments,1),o=0,h=r.length;h>o;o++)for(n in r[o])a=r[o][n],r[o].hasOwnProperty(n)&&a!==t&&(i[n]=e.isPlainObject(a)?e.isPlainObject(i[n])?e.widget.extend({},i[n],a):e.widget.extend({},a):a);return i},e.widget.bridge=function(i,n){var a=n.prototype.widgetFullName||i;e.fn[i]=function(r){var o="string"==typeof r,h=s.call(arguments,1),l=this;return r=!o&&h.length?e.widget.extend.apply(null,[r].concat(h)):r,o?this.each(function(){var s,n=e.data(this,a);return n?e.isFunction(n[r])&&"_"!==r.charAt(0)?(s=n[r].apply(n,h),s!==n&&s!==t?(l=s&&s.jquery?l.pushStack(s.get()):s,!1):t):e.error("no such method '"+r+"' for "+i+" widget instance"):e.error("cannot call methods on "+i+" prior to initialization; "+"attempted to call method '"+r+"'")}):this.each(function(){var t=e.data(this,a);t?t.option(r||{})._init():e.data(this,a,new n(r,this))}),l}},e.Widget=function(){},e.Widget._childConstructors=[],e.Widget.prototype={widgetName:"widget",widgetEventPrefix:"",defaultElement:"<div>",options:{disabled:!1,create:null},_createWidget:function(t,s){s=e(s||this.defaultElement||this)[0],this.element=e(s),this.uuid=i++,this.eventNamespace="."+this.widgetName+this.uuid,this.options=e.widget.extend({},this.options,this._getCreateOptions(),t),this.bindings=e(),this.hoverable=e(),this.focusable=e(),s!==this&&(e.data(s,this.widgetFullName,this),this._on(!0,this.element,{remove:function(e){e.target===s&&this.destroy()}}),this.document=e(s.style?s.ownerDocument:s.document||s),this.window=e(this.document[0].defaultView||this.document[0].parentWindow)),this._create(),this._trigger("create",null,this._getCreateEventData()),this._init()},_getCreateOptions:e.noop,_getCreateEventData:e.noop,_create:e.noop,_init:e.noop,destroy:function(){this._destroy(),this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)),this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName+"-disabled "+"ui-state-disabled"),this.bindings.unbind(this.eventNamespace),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")},_destroy:e.noop,widget:function(){return this.element},option:function(i,s){var n,a,r,o=i;if(0===arguments.length)return e.widget.extend({},this.options);if("string"==typeof i)if(o={},n=i.split("."),i=n.shift(),n.length){for(a=o[i]=e.widget.extend({},this.options[i]),r=0;n.length-1>r;r++)a[n[r]]=a[n[r]]||{},a=a[n[r]];if(i=n.pop(),s===t)return a[i]===t?null:a[i];a[i]=s}else{if(s===t)return this.options[i]===t?null:this.options[i];o[i]=s}return this._setOptions(o),this},_setOptions:function(e){var t;for(t in e)this._setOption(t,e[t]);return this},_setOption:function(e,t){return this.options[e]=t,"disabled"===e&&(this.widget().toggleClass(this.widgetFullName+"-disabled ui-state-disabled",!!t).attr("aria-disabled",t),this.hoverable.removeClass("ui-state-hover"),this.focusable.removeClass("ui-state-focus")),this},enable:function(){return this._setOption("disabled",!1)},disable:function(){return this._setOption("disabled",!0)},_on:function(i,s,n){var a,r=this;"boolean"!=typeof i&&(n=s,s=i,i=!1),n?(s=a=e(s),this.bindings=this.bindings.add(s)):(n=s,s=this.element,a=this.widget()),e.each(n,function(n,o){function h(){return i||r.options.disabled!==!0&&!e(this).hasClass("ui-state-disabled")?("string"==typeof o?r[o]:o).apply(r,arguments):t}"string"!=typeof o&&(h.guid=o.guid=o.guid||h.guid||e.guid++);var l=n.match(/^(\w+)\s*(.*)$/),u=l[1]+r.eventNamespace,c=l[2];c?a.delegate(c,u,h):s.bind(u,h)})},_off:function(e,t){t=(t||"").split(" ").join(this.eventNamespace+" ")+this.eventNamespace,e.unbind(t).undelegate(t)},_delay:function(e,t){function i(){return("string"==typeof e?s[e]:e).apply(s,arguments)}var s=this;return setTimeout(i,t||0)},_hoverable:function(t){this.hoverable=this.hoverable.add(t),this._on(t,{mouseenter:function(t){e(t.currentTarget).addClass("ui-state-hover")},mouseleave:function(t){e(t.currentTarget).removeClass("ui-state-hover")}})},_focusable:function(t){this.focusable=this.focusable.add(t),this._on(t,{focusin:function(t){e(t.currentTarget).addClass("ui-state-focus")},focusout:function(t){e(t.currentTarget).removeClass("ui-state-focus")}})},_trigger:function(t,i,s){var n,a,r=this.options[t];if(s=s||{},i=e.Event(i),i.type=(t===this.widgetEventPrefix?t:this.widgetEventPrefix+t).toLowerCase(),i.target=this.element[0],a=i.originalEvent)for(n in a)n in i||(i[n]=a[n]);return this.element.trigger(i,s),!(e.isFunction(r)&&r.apply(this.element[0],[i].concat(s))===!1||i.isDefaultPrevented())}},e.each({show:"fadeIn",hide:"fadeOut"},function(t,i){e.Widget.prototype["_"+t]=function(s,n,a){"string"==typeof n&&(n={effect:n});var r,o=n?n===!0||"number"==typeof n?i:n.effect||i:t;n=n||{},"number"==typeof n&&(n={duration:n}),r=!e.isEmptyObject(n),n.complete=a,n.delay&&s.delay(n.delay),r&&e.effects&&e.effects.effect[o]?s[t](n):o!==t&&s[o]?s[o](n.duration,n.easing,a):s.queue(function(i){e(this)[t](),a&&a.call(s[0]),i()})}})})(jQuery);



//position

/*! jQuery UI - v1.10.3 - 2013-05-03
 * http://jqueryui.com
 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function(t,e){function i(t,e,i){return[parseFloat(t[0])*(p.test(t[0])?e/100:1),parseFloat(t[1])*(p.test(t[1])?i/100:1)]}function s(e,i){return parseInt(t.css(e,i),10)||0}function n(e){var i=e[0];return 9===i.nodeType?{width:e.width(),height:e.height(),offset:{top:0,left:0}}:t.isWindow(i)?{width:e.width(),height:e.height(),offset:{top:e.scrollTop(),left:e.scrollLeft()}}:i.preventDefault?{width:0,height:0,offset:{top:i.pageY,left:i.pageX}}:{width:e.outerWidth(),height:e.outerHeight(),offset:e.offset()}}t.ui=t.ui||{};var a,o=Math.max,r=Math.abs,h=Math.round,l=/left|center|right/,c=/top|center|bottom/,u=/[\+\-]\d+(\.[\d]+)?%?/,d=/^\w+/,p=/%$/,f=t.fn.position;t.position={scrollbarWidth:function(){if(a!==e)return a;var i,s,n=t("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),o=n.children()[0];return t("body").append(n),i=o.offsetWidth,n.css("overflow","scroll"),s=o.offsetWidth,i===s&&(s=n[0].clientWidth),n.remove(),a=i-s},getScrollInfo:function(e){var i=e.isWindow?"":e.element.css("overflow-x"),s=e.isWindow?"":e.element.css("overflow-y"),n="scroll"===i||"auto"===i&&e.width<e.element[0].scrollWidth,a="scroll"===s||"auto"===s&&e.height<e.element[0].scrollHeight;return{width:a?t.position.scrollbarWidth():0,height:n?t.position.scrollbarWidth():0}},getWithinInfo:function(e){var i=t(e||window),s=t.isWindow(i[0]);return{element:i,isWindow:s,offset:i.offset()||{left:0,top:0},scrollLeft:i.scrollLeft(),scrollTop:i.scrollTop(),width:s?i.width():i.outerWidth(),height:s?i.height():i.outerHeight()}}},t.fn.position=function(e){if(!e||!e.of)return f.apply(this,arguments);e=t.extend({},e);var a,p,m,g,v,b,_=t(e.of),y=t.position.getWithinInfo(e.within),w=t.position.getScrollInfo(y),x=(e.collision||"flip").split(" "),k={};return b=n(_),_[0].preventDefault&&(e.at="left top"),p=b.width,m=b.height,g=b.offset,v=t.extend({},g),t.each(["my","at"],function(){var t,i,s=(e[this]||"").split(" ");1===s.length&&(s=l.test(s[0])?s.concat(["center"]):c.test(s[0])?["center"].concat(s):["center","center"]),s[0]=l.test(s[0])?s[0]:"center",s[1]=c.test(s[1])?s[1]:"center",t=u.exec(s[0]),i=u.exec(s[1]),k[this]=[t?t[0]:0,i?i[0]:0],e[this]=[d.exec(s[0])[0],d.exec(s[1])[0]]}),1===x.length&&(x[1]=x[0]),"right"===e.at[0]?v.left+=p:"center"===e.at[0]&&(v.left+=p/2),"bottom"===e.at[1]?v.top+=m:"center"===e.at[1]&&(v.top+=m/2),a=i(k.at,p,m),v.left+=a[0],v.top+=a[1],this.each(function(){var n,l,c=t(this),u=c.outerWidth(),d=c.outerHeight(),f=s(this,"marginLeft"),b=s(this,"marginTop"),D=u+f+s(this,"marginRight")+w.width,T=d+b+s(this,"marginBottom")+w.height,C=t.extend({},v),M=i(k.my,c.outerWidth(),c.outerHeight());"right"===e.my[0]?C.left-=u:"center"===e.my[0]&&(C.left-=u/2),"bottom"===e.my[1]?C.top-=d:"center"===e.my[1]&&(C.top-=d/2),C.left+=M[0],C.top+=M[1],t.support.offsetFractions||(C.left=h(C.left),C.top=h(C.top)),n={marginLeft:f,marginTop:b},t.each(["left","top"],function(i,s){t.ui.position[x[i]]&&t.ui.position[x[i]][s](C,{targetWidth:p,targetHeight:m,elemWidth:u,elemHeight:d,collisionPosition:n,collisionWidth:D,collisionHeight:T,offset:[a[0]+M[0],a[1]+M[1]],my:e.my,at:e.at,within:y,elem:c})}),e.using&&(l=function(t){var i=g.left-C.left,s=i+p-u,n=g.top-C.top,a=n+m-d,h={target:{element:_,left:g.left,top:g.top,width:p,height:m},element:{element:c,left:C.left,top:C.top,width:u,height:d},horizontal:0>s?"left":i>0?"right":"center",vertical:0>a?"top":n>0?"bottom":"middle"};u>p&&p>r(i+s)&&(h.horizontal="center"),d>m&&m>r(n+a)&&(h.vertical="middle"),h.important=o(r(i),r(s))>o(r(n),r(a))?"horizontal":"vertical",e.using.call(this,t,h)}),c.offset(t.extend(C,{using:l}))})},t.ui.position={fit:{left:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollLeft:s.offset.left,a=s.width,r=t.left-e.collisionPosition.marginLeft,h=n-r,l=r+e.collisionWidth-a-n;e.collisionWidth>a?h>0&&0>=l?(i=t.left+h+e.collisionWidth-a-n,t.left+=h-i):t.left=l>0&&0>=h?n:h>l?n+a-e.collisionWidth:n:h>0?t.left+=h:l>0?t.left-=l:t.left=o(t.left-r,t.left)},top:function(t,e){var i,s=e.within,n=s.isWindow?s.scrollTop:s.offset.top,a=e.within.height,r=t.top-e.collisionPosition.marginTop,h=n-r,l=r+e.collisionHeight-a-n;e.collisionHeight>a?h>0&&0>=l?(i=t.top+h+e.collisionHeight-a-n,t.top+=h-i):t.top=l>0&&0>=h?n:h>l?n+a-e.collisionHeight:n:h>0?t.top+=h:l>0?t.top-=l:t.top=o(t.top-r,t.top)}},flip:{left:function(t,e){var i,s,n=e.within,a=n.offset.left+n.scrollLeft,o=n.width,h=n.isWindow?n.scrollLeft:n.offset.left,l=t.left-e.collisionPosition.marginLeft,c=l-h,u=l+e.collisionWidth-o-h,d="left"===e.my[0]?-e.elemWidth:"right"===e.my[0]?e.elemWidth:0,p="left"===e.at[0]?e.targetWidth:"right"===e.at[0]?-e.targetWidth:0,f=-2*e.offset[0];0>c?(i=t.left+d+p+f+e.collisionWidth-o-a,(0>i||r(c)>i)&&(t.left+=d+p+f)):u>0&&(s=t.left-e.collisionPosition.marginLeft+d+p+f-h,(s>0||u>r(s))&&(t.left+=d+p+f))},top:function(t,e){var i,s,n=e.within,a=n.offset.top+n.scrollTop,o=n.height,h=n.isWindow?n.scrollTop:n.offset.top,l=t.top-e.collisionPosition.marginTop,c=l-h,u=l+e.collisionHeight-o-h,d="top"===e.my[1],p=d?-e.elemHeight:"bottom"===e.my[1]?e.elemHeight:0,f="top"===e.at[1]?e.targetHeight:"bottom"===e.at[1]?-e.targetHeight:0,m=-2*e.offset[1];0>c?(s=t.top+p+f+m+e.collisionHeight-o-a,t.top+p+f+m>c&&(0>s||r(c)>s)&&(t.top+=p+f+m)):u>0&&(i=t.top-e.collisionPosition.marginTop+p+f+m-h,t.top+p+f+m>u&&(i>0||u>r(i))&&(t.top+=p+f+m))}},flipfit:{left:function(){t.ui.position.flip.left.apply(this,arguments),t.ui.position.fit.left.apply(this,arguments)},top:function(){t.ui.position.flip.top.apply(this,arguments),t.ui.position.fit.top.apply(this,arguments)}}},function(){var e,i,s,n,a,o=document.getElementsByTagName("body")[0],r=document.createElement("div");e=document.createElement(o?"div":"body"),s={visibility:"hidden",width:0,height:0,border:0,margin:0,background:"none"},o&&t.extend(s,{position:"absolute",left:"-1000px",top:"-1000px"});for(a in s)e.style[a]=s[a];e.appendChild(r),i=o||document.documentElement,i.insertBefore(e,i.firstChild),r.style.cssText="position: absolute; left: 10.7432222px;",n=t(r).offset().left,t.support.offsetFractions=n>10&&11>n,e.innerHTML="",i.removeChild(e)}()})(jQuery);



//menu

/*! jQuery UI - v1.10.3 - 2013-05-03
 * http://jqueryui.com
 * Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */
(function(t){t.widget("ui.menu",{version:"1.10.3",defaultElement:"<ul>",delay:300,options:{icons:{submenu:"ui-icon-carat-1-e"},menus:"ul",position:{my:"left top",at:"right top"},role:"menu",blur:null,focus:null,select:null},_create:function(){this.activeMenu=this.element,this.mouseHandled=!1,this.element.uniqueId().addClass("ui-menu ui-widget ui-widget-content ui-corner-all").toggleClass("ui-menu-icons",!!this.element.find(".ui-icon").length).attr({role:this.options.role,tabIndex:0}).bind("click"+this.eventNamespace,t.proxy(function(t){this.options.disabled&&t.preventDefault()},this)),this.options.disabled&&this.element.addClass("ui-state-disabled").attr("aria-disabled","true"),this._on({"mousedown .ui-menu-item > a":function(t){t.preventDefault()},"click .ui-state-disabled > a":function(t){t.preventDefault()},"click .ui-menu-item:has(a)":function(e){var i=t(e.target).closest(".ui-menu-item");!this.mouseHandled&&i.not(".ui-state-disabled").length&&(this.mouseHandled=!0,this.select(e),i.has(".ui-menu").length?this.expand(e):this.element.is(":focus")||(this.element.trigger("focus",[!0]),this.active&&1===this.active.parents(".ui-menu").length&&clearTimeout(this.timer)))},"mouseenter .ui-menu-item":function(e){var i=t(e.currentTarget);i.siblings().children(".ui-state-active").removeClass("ui-state-active"),this.focus(e,i)},mouseleave:"collapseAll","mouseleave .ui-menu":"collapseAll",focus:function(t,e){var i=this.active||this.element.children(".ui-menu-item").eq(0);e||this.focus(t,i)},blur:function(e){this._delay(function(){t.contains(this.element[0],this.document[0].activeElement)||this.collapseAll(e)})},keydown:"_keydown"}),this.refresh(),this._on(this.document,{click:function(e){t(e.target).closest(".ui-menu").length||this.collapseAll(e),this.mouseHandled=!1}})},_destroy:function(){this.element.removeAttr("aria-activedescendant").find(".ui-menu").addBack().removeClass("ui-menu ui-widget ui-widget-content ui-corner-all ui-menu-icons").removeAttr("role").removeAttr("tabIndex").removeAttr("aria-labelledby").removeAttr("aria-expanded").removeAttr("aria-hidden").removeAttr("aria-disabled").removeUniqueId().show(),this.element.find(".ui-menu-item").removeClass("ui-menu-item").removeAttr("role").removeAttr("aria-disabled").children("a").removeUniqueId().removeClass("ui-corner-all ui-state-hover").removeAttr("tabIndex").removeAttr("role").removeAttr("aria-haspopup").children().each(function(){var e=t(this);e.data("ui-menu-submenu-carat")&&e.remove()}),this.element.find(".ui-menu-divider").removeClass("ui-menu-divider ui-widget-content")},_keydown:function(e){function i(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")}var s,n,a,o,r,h=!0;switch(e.keyCode){case t.ui.keyCode.PAGE_UP:this.previousPage(e);break;case t.ui.keyCode.PAGE_DOWN:this.nextPage(e);break;case t.ui.keyCode.HOME:this._move("first","first",e);break;case t.ui.keyCode.END:this._move("last","last",e);break;case t.ui.keyCode.UP:this.previous(e);break;case t.ui.keyCode.DOWN:this.next(e);break;case t.ui.keyCode.LEFT:this.collapse(e);break;case t.ui.keyCode.RIGHT:this.active&&!this.active.is(".ui-state-disabled")&&this.expand(e);break;case t.ui.keyCode.ENTER:case t.ui.keyCode.SPACE:this._activate(e);break;case t.ui.keyCode.ESCAPE:this.collapse(e);break;default:h=!1,n=this.previousFilter||"",a=String.fromCharCode(e.keyCode),o=!1,clearTimeout(this.filterTimer),a===n?o=!0:a=n+a,r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())}),s=o&&-1!==s.index(this.active.next())?this.active.nextAll(".ui-menu-item"):s,s.length||(a=String.fromCharCode(e.keyCode),r=RegExp("^"+i(a),"i"),s=this.activeMenu.children(".ui-menu-item").filter(function(){return r.test(t(this).children("a").text())})),s.length?(this.focus(e,s),s.length>1?(this.previousFilter=a,this.filterTimer=this._delay(function(){delete this.previousFilter},1e3)):delete this.previousFilter):delete this.previousFilter}h&&e.preventDefault()},_activate:function(t){this.active.is(".ui-state-disabled")||(this.active.children("a[aria-haspopup='true']").length?this.expand(t):this.select(t))},refresh:function(){var e,i=this.options.icons.submenu,s=this.element.find(this.options.menus);s.filter(":not(.ui-menu)").addClass("ui-menu ui-widget ui-widget-content ui-corner-all").hide().attr({role:this.options.role,"aria-hidden":"true","aria-expanded":"false"}).each(function(){var e=t(this),s=e.prev("a"),n=t("<span>").addClass("ui-menu-icon ui-icon "+i).data("ui-menu-submenu-carat",!0);s.attr("aria-haspopup","true").prepend(n),e.attr("aria-labelledby",s.attr("id"))}),e=s.add(this.element),e.children(":not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role","presentation").children("a").uniqueId().addClass("ui-corner-all").attr({tabIndex:-1,role:this._itemRole()}),e.children(":not(.ui-menu-item)").each(function(){var e=t(this);/[^\-\u2014\u2013\s]/.test(e.text())||e.addClass("ui-widget-content ui-menu-divider")}),e.children(".ui-state-disabled").attr("aria-disabled","true"),this.active&&!t.contains(this.element[0],this.active[0])&&this.blur()},_itemRole:function(){return{menu:"menuitem",listbox:"option"}[this.options.role]},_setOption:function(t,e){"icons"===t&&this.element.find(".ui-menu-icon").removeClass(this.options.icons.submenu).addClass(e.submenu),this._super(t,e)},focus:function(t,e){var i,s;this.blur(t,t&&"focus"===t.type),this._scrollIntoView(e),this.active=e.first(),s=this.active.children("a").addClass("ui-state-focus"),this.options.role&&this.element.attr("aria-activedescendant",s.attr("id")),this.active.parent().closest(".ui-menu-item").children("a:first").addClass("ui-state-active"),t&&"keydown"===t.type?this._close():this.timer=this._delay(function(){this._close()},this.delay),i=e.children(".ui-menu"),i.length&&/^mouse/.test(t.type)&&this._startOpening(i),this.activeMenu=e.parent(),this._trigger("focus",t,{item:e})},_scrollIntoView:function(e){var i,s,n,a,o,r;this._hasScroll()&&(i=parseFloat(t.css(this.activeMenu[0],"borderTopWidth"))||0,s=parseFloat(t.css(this.activeMenu[0],"paddingTop"))||0,n=e.offset().top-this.activeMenu.offset().top-i-s,a=this.activeMenu.scrollTop(),o=this.activeMenu.height(),r=e.height(),0>n?this.activeMenu.scrollTop(a+n):n+r>o&&this.activeMenu.scrollTop(a+n-o+r))},blur:function(t,e){e||clearTimeout(this.timer),this.active&&(this.active.children("a").removeClass("ui-state-focus"),this.active=null,this._trigger("blur",t,{item:this.active}))},_startOpening:function(t){clearTimeout(this.timer),"true"===t.attr("aria-hidden")&&(this.timer=this._delay(function(){this._close(),this._open(t)},this.delay))},_open:function(e){var i=t.extend({of:this.active},this.options.position);clearTimeout(this.timer),this.element.find(".ui-menu").not(e.parents(".ui-menu")).hide().attr("aria-hidden","true"),e.show().removeAttr("aria-hidden").attr("aria-expanded","true").position(i)},collapseAll:function(e,i){clearTimeout(this.timer),this.timer=this._delay(function(){var s=i?this.element:t(e&&e.target).closest(this.element.find(".ui-menu"));s.length||(s=this.element),this._close(s),this.blur(e),this.activeMenu=s},this.delay)},_close:function(t){t||(t=this.active?this.active.parent():this.element),t.find(".ui-menu").hide().attr("aria-hidden","true").attr("aria-expanded","false").end().find("a.ui-state-active").removeClass("ui-state-active")},collapse:function(t){var e=this.active&&this.active.parent().closest(".ui-menu-item",this.element);e&&e.length&&(this._close(),this.focus(t,e))},expand:function(t){var e=this.active&&this.active.children(".ui-menu ").children(".ui-menu-item").first();e&&e.length&&(this._open(e.parent()),this._delay(function(){this.focus(t,e)}))},next:function(t){this._move("next","first",t)},previous:function(t){this._move("prev","last",t)},isFirstItem:function(){return this.active&&!this.active.prevAll(".ui-menu-item").length},isLastItem:function(){return this.active&&!this.active.nextAll(".ui-menu-item").length},_move:function(t,e,i){var s;this.active&&(s="first"===t||"last"===t?this.active["first"===t?"prevAll":"nextAll"](".ui-menu-item").eq(-1):this.active[t+"All"](".ui-menu-item").eq(0)),s&&s.length&&this.active||(s=this.activeMenu.children(".ui-menu-item")[e]()),this.focus(i,s)},nextPage:function(e){var i,s,n;return this.active?(this.isLastItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.nextAll(".ui-menu-item").each(function(){return i=t(this),0>i.offset().top-s-n}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item")[this.active?"last":"first"]())),undefined):(this.next(e),undefined)},previousPage:function(e){var i,s,n;return this.active?(this.isFirstItem()||(this._hasScroll()?(s=this.active.offset().top,n=this.element.height(),this.active.prevAll(".ui-menu-item").each(function(){return i=t(this),i.offset().top-s+n>0}),this.focus(e,i)):this.focus(e,this.activeMenu.children(".ui-menu-item").first())),undefined):(this.next(e),undefined)},_hasScroll:function(){return this.element.outerHeight()<this.element.prop("scrollHeight")},select:function(e){this.active=this.active||t(e.target).closest(".ui-menu-item");var i={item:this.active};this.active.has(".ui-menu").length||this.collapseAll(e,!0),this._trigger("select",e,i)}})})(jQuery);


//autocomplete (autocomplete chenged to cm_autocomplete)
(function(t){var e=0;t.widget("ui.cm_autocomplete",{version:"1.10.3",defaultElement:"<input>",options:{appendTo:null,autoFocus:!1,delay:300,minLength:1,position:{my:"left top",at:"left bottom",collision:"none"},source:null,change:null,close:null,focus:null,open:null,response:null,search:null,select:null},pending:0,_create:function(){var e,i,s,n=this.element[0].nodeName.toLowerCase(),a="textarea"===n,o="input"===n;this.isMultiLine=a?!0:o?!1:this.element.prop("isContentEditable"),this.valueMethod=this.element[a||o?"val":"text"],this.isNewMenu=!0,this.element.addClass("ui-cm_autocomplete-input").attr("cm_autocomplete","off"),this._on(this.element,{keydown:function(n){if(this.element.prop("readOnly"))return e=!0,s=!0,i=!0,undefined;e=!1,s=!1,i=!1;var a=t.ui.keyCode;switch(n.keyCode){case a.PAGE_UP:e=!0,this._move("previousPage",n);break;case a.PAGE_DOWN:e=!0,this._move("nextPage",n);break;case a.UP:e=!0,this._keyEvent("previous",n);break;case a.DOWN:e=!0,this._keyEvent("next",n);break;case a.ENTER:case a.NUMPAD_ENTER:this.menu.active&&(e=!0,n.preventDefault(),this.menu.select(n));break;case a.TAB:this.menu.active&&this.menu.select(n);break;case a.ESCAPE:this.menu.element.is(":visible")&&(this._value(this.term),this.close(n),n.preventDefault());break;default:i=!0,this._searchTimeout(n)}},keypress:function(s){if(e)return e=!1,(!this.isMultiLine||this.menu.element.is(":visible"))&&s.preventDefault(),undefined;if(!i){var n=t.ui.keyCode;switch(s.keyCode){case n.PAGE_UP:this._move("previousPage",s);break;case n.PAGE_DOWN:this._move("nextPage",s);break;case n.UP:this._keyEvent("previous",s);break;case n.DOWN:this._keyEvent("next",s)}}},input:function(t){return s?(s=!1,t.preventDefault(),undefined):(this._searchTimeout(t),undefined)},focus:function(){this.selectedItem=null,this.previous=this._value()},blur:function(t){return this.cancelBlur?(delete this.cancelBlur,undefined):(clearTimeout(this.searching),this.close(t),this._change(t),undefined)}}),this._initSource(),this.menu=t("<ul>").addClass("ui-cm_autocomplete ui-front").appendTo(this._appendTo()).menu({role:null}).hide().data("ui-menu"),this._on(this.menu.element,{mousedown:function(e){e.preventDefault(),this.cancelBlur=!0,this._delay(function(){delete this.cancelBlur});var i=this.menu.element[0];t(e.target).closest(".ui-menu-item").length||this._delay(function(){var e=this;this.document.one("mousedown",function(s){s.target===e.element[0]||s.target===i||t.contains(i,s.target)||e.close()})})},menufocus:function(e,i){if(this.isNewMenu&&(this.isNewMenu=!1,e.originalEvent&&/^mouse/.test(e.originalEvent.type)))return this.menu.blur(),this.document.one("mousemove",function(){t(e.target).trigger(e.originalEvent)}),undefined;var s=i.item.data("ui-cm_autocomplete-item");!1!==this._trigger("focus",e,{item:s})?e.originalEvent&&/^key/.test(e.originalEvent.type)&&this._value(s.value):this.liveRegion.text(s.value)},menuselect:function(t,e){var i=e.item.data("ui-cm_autocomplete-item"),s=this.previous;this.element[0]!==this.document[0].activeElement&&(this.element.focus(),this.previous=s,this._delay(function(){this.previous=s,this.selectedItem=i})),!1!==this._trigger("select",t,{item:i})&&this._value(i.value),this.term=this._value(),this.close(t),this.selectedItem=i}}),this.liveRegion=t("<span>",{role:"status","aria-live":"polite"}).addClass("ui-helper-hidden-accessible").insertBefore(this.element),this._on(this.window,{beforeunload:function(){this.element.removeAttr("cm_autocomplete")}})},_destroy:function(){clearTimeout(this.searching),this.element.removeClass("ui-cm_autocomplete-input").removeAttr("cm_autocomplete"),this.menu.element.remove(),this.liveRegion.remove()},_setOption:function(t,e){this._super(t,e),"source"===t&&this._initSource(),"appendTo"===t&&this.menu.element.appendTo(this._appendTo()),"disabled"===t&&e&&this.xhr&&this.xhr.abort()},_appendTo:function(){var e=this.options.appendTo;return e&&(e=e.jquery||e.nodeType?t(e):this.document.find(e).eq(0)),e||(e=this.element.closest(".ui-front")),e.length||(e=this.document[0].body),e},_initSource:function(){var e,i,s=this;t.isArray(this.options.source)?(e=this.options.source,this.source=function(i,s){s(t.ui.cm_autocomplete.filter(e,i.term))}):"string"==typeof this.options.source?(i=this.options.source,this.source=function(e,n){s.xhr&&s.xhr.abort(),s.xhr=t.ajax({url:i,data:e,dataType:"json",success:function(t){n(t)},error:function(){n([])}})}):this.source=this.options.source},_searchTimeout:function(t){clearTimeout(this.searching),this.searching=this._delay(function(){this.term!==this._value()&&(this.selectedItem=null,this.search(null,t))},this.options.delay)},search:function(t,e){return t=null!=t?t:this._value(),this.term=this._value(),t.length<this.options.minLength?this.close(e):this._trigger("search",e)!==!1?this._search(t):undefined},_search:function(t){this.pending++,this.element.addClass("ui-cm_autocomplete-loading"),this.cancelSearch=!1,this.source({term:t},this._response())},_response:function(){var t=this,i=++e;return function(s){i===e&&t.__response(s),t.pending--,t.pending||t.element.removeClass("ui-cm_autocomplete-loading")}},__response:function(t){t&&(t=this._normalize(t)),this._trigger("response",null,{content:t}),!this.options.disabled&&t&&t.length&&!this.cancelSearch?(this._suggest(t),this._trigger("open")):this._close()},close:function(t){this.cancelSearch=!0,this._close(t)},_close:function(t){this.menu.element.is(":visible")&&(this.menu.element.hide(),this.menu.blur(),this.isNewMenu=!0,this._trigger("close",t))},_change:function(t){this.previous!==this._value()&&this._trigger("change",t,{item:this.selectedItem})},_normalize:function(e){return e.length&&e[0].label&&e[0].value?e:t.map(e,function(e){return"string"==typeof e?{label:e,value:e}:t.extend({label:e.label||e.value,value:e.value||e.label},e)})},_suggest:function(e){var i=this.menu.element.empty();this._renderMenu(i,e),this.isNewMenu=!0,this.menu.refresh(),i.show(),this._resizeMenu(),i.position(t.extend({of:this.element},this.options.position)),this.options.autoFocus&&this.menu.next()},_resizeMenu:function(){var t=this.menu.element;t.outerWidth(Math.max(t.width("").outerWidth()+1,this.element.outerWidth()))},_renderMenu:function(e,i){var s=this;t.each(i,function(t,i){s._renderItemData(e,i)})},_renderItemData:function(t,e){return this._renderItem(t,e).data("ui-cm_autocomplete-item",e)},_renderItem:function(e,i){return t("<li>").append(t("<a>").text(i.label)).appendTo(e)},_move:function(t,e){return this.menu.element.is(":visible")?this.menu.isFirstItem()&&/^previous/.test(t)||this.menu.isLastItem()&&/^next/.test(t)?(this._value(this.term),this.menu.blur(),undefined):(this.menu[t](e),undefined):(this.search(null,e),undefined)},widget:function(){return this.menu.element},_value:function(){return this.valueMethod.apply(this.element,arguments)},_keyEvent:function(t,e){(!this.isMultiLine||this.menu.element.is(":visible"))&&(this._move(t,e),e.preventDefault())}}),t.extend(t.ui.cm_autocomplete,{escapeRegex:function(t){return t.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g,"\\$&")},filter:function(e,i){var s=RegExp(t.ui.cm_autocomplete.escapeRegex(i),"i");return t.grep(e,function(t){return s.test(t.label||t.value||t)})}}),t.widget("ui.cm_autocomplete",t.ui.cm_autocomplete,{options:{messages:{noResults:"No search results.",results:function(t){return t+(t>1?" results are":" result is")+" available, use up and down arrow keys to navigate."}}},__response:function(t){var e;this._superApply(arguments),this.options.disabled||this.cancelSearch||(e=t&&t.length?this.options.messages.results(t.length):this.options.messages.noResults,this.liveRegion.text(e))}})})(jQuery);