$(function () { // Same as document.addEventListener("DOMContentLoaded"...

  // Same as document.querySelector("#navbarToggle").addEventListener("blur",...
  $("#navbarToggle").blur(function (event) {
    var screenWidth = window.innerWidth;
    if (screenWidth < 768) {
      $("#collapsable-nav").collapse('hide');
    }
  });

  // In Firefox and Safari, the click event doesn't retain the focus
  // on the clicked button. Therefore, the blur event will not fire on
  // user clicking somewhere else in the page and the blur event handler
  // which is set up above will not be called.
  // Refer to issue #28 in the repo.
  // Solution: force focus on the element that the click event fired on
  $("#navbarToggle").click(function (event) {
    $(event.target).focus();
  });
});

(function (global) {

var dc = {};

var homeHtml = "snippets/home-snippet.html";
var egitimUrl = "json/egitim.json";
var egitimTitleHtml = "snippets/categories-title-snippet.html";
var egitimHtml = "snippets/category-snippet.html";

var donemUrl = "json/egitim.json";
var donemTitleHtml = "snippets/menu-items-title.html";
var donemHtml = "snippets/menu-item.html";

var sinifTitleHtml = "snippets/sinif-items-title.html";
var sinifHtml = "snippets/sinif-item.html";

var programTitleHtml = "snippets/program-items-title.html";
var programHtml = "snippets/program-item.html";

var program2TitleHtml = "snippets/program2-items-title.html";
var program2Html = "snippets/program2-item.html";

var egitimName;
var donemName;
var sinifNum;
var personelName;

var personelUrl = "json/personel.json";
var personelHtml = "snippets/personeller-snippet.html";
var personelTitleHtml = "snippets/personel-title.html";

var personelBilgiTitleHtml = "snippets/personel-bilgi-title.html";
var personelBilgiHtml = "snippets/personel-bilgi.html";


// Convenience function for inserting innerHTML for 'select'
var insertHtml = function (selector, html) {
  var targetElem = document.querySelector(selector);
  targetElem.innerHTML = html;
};

// Show loading icon inside element identified by 'selector'.
var showLoading = function (selector) {
  var html = "<div class='text-center'>";
  html += "<img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
};

// Return substitute of '{{propName}}'
// with propValue in given 'string'
var insertProperty = function (string, propName, propValue) {
  var propToReplace = "{{" + propName + "}}";
  string = string
    .replace(new RegExp(propToReplace, "g"), propValue);
  return string;
}

// On page load (before images or CSS)
document.addEventListener("DOMContentLoaded", function (event) {

// On first load, show home view
showLoading("#main-content");
$ajaxUtils.sendGetRequest(
  homeHtml,
  function (responseText) {
    document.querySelector("#main-content")
      .innerHTML = responseText;
  },
  false);
});

// Load the menu categories view
dc.loadMenuCategories = function () {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    egitimUrl,
    egitimAyarlaGoster);
};


// Load the menu items view
// 'categoryShort' is a short_name for a category
dc.loadMenuItems = function (egitimShort) {
  showLoading("#main-content");
  $ajaxUtils.sendGetRequest(
    donemUrl,
    donemAyarlaGoster);
  egitimName = egitimShort;
};

dc.loadSinifItems = function (donemShort) {
    if(donemShort.includes('L'))
    {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
  egitimUrl,
  sinifAyarlaGoster);
    donemName = donemShort;
    }
    else
    {
        showLoading("#main-content");
        $ajaxUtils.sendGetRequest(
      egitimUrl,
      program2AyarlaGoster);
        donemName = donemShort;
    }

}

dc.loadProgramItems = function (sinifShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
  egitimUrl,
  programAyarlaGoster);
    sinifNum = sinifShort;
}

dc.loadPersonelItems = function () {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        personelUrl,
        personelAyarlaGoster);
}

dc.loadPersonelBilgi = function (personelShort) {
    showLoading("#main-content");
    $ajaxUtils.sendGetRequest(
        personelUrl,
        personelBilgiAyarlaGoster);
    personelName = personelShort;
}

// Builds HTML for the categories page based on the data
// from the server
function egitimAyarlaGoster (egitimler) {
  // Load title snippet of categories page
  $ajaxUtils.sendGetRequest(
    egitimTitleHtml,
    function (egitimTitleHtml) {
      // Retrieve single category snippet
      $ajaxUtils.sendGetRequest(
        egitimHtml,
        function (egitimHtml) {

          var egitimGoruntuleHtml =
            egitimAyarlaGoruntule(egitimler,
                                    egitimTitleHtml,
                                    egitimHtml);
          insertHtml("#main-content", egitimGoruntuleHtml);
        },
        false);
    },
    false);
}


// Using categories data and snippets html
// build categories view HTML to be inserted into page
function egitimAyarlaGoruntule(egitimler,
                                 egitimTitleHtml,
                                 egitimHtml) {
    
  var finalHtml = egitimTitleHtml;
  finalHtml += "<section class='row'>";

  // Loop over categories
  for (var i = 0; i < egitimler.length; i++) {
    // Insert category values
    var html = egitimHtml;
    var name = "" + egitimler[i].name;
    var short_name = egitimler[i].short_name;
    html =
      insertProperty(html, "name", name);
    html =
      insertProperty(html,
                     "short_name",
                     short_name);
    finalHtml += html;
  }

  finalHtml += "</section>";
  return finalHtml;
}



// Builds HTML for the single category page based on the data
// from the server
function donemAyarlaGoster(egitimDonemleri) {
  // Load title snippet of menu items page
  $ajaxUtils.sendGetRequest(
    donemTitleHtml,
    function (donemTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        donemHtml,
        function (donemHtml) {

          var donemGoruntule =
            donemAyarlaGoruntule(egitimDonemleri,
                                   donemTitleHtml,
                                   donemHtml);
          insertHtml("#main-content", donemGoruntule);
        },
        false);
    },
    false);
}

// Using category and menu items data and snippets html
// build menu items view HTML to be inserted into page
function donemAyarlaGoruntule(egitimDonemleri,
                                donemTitleHtml,
                                donemHtml) {
  
  donemTitleHtml =
    insertProperty(donemTitleHtml,
                   "name",
                   egitimDonemleri.short_name);
  /*menuItemsTitleHtml =
    insertProperty(menuItemsTitleHtml,
                   "special_instructions",
                   categoryMenuItems.category.special_instructions);*/

  var finalHtml = donemTitleHtml;
  finalHtml += "<section class='row'>";

    // Loop over menu items
  
  var menuItems;
 // var menuItems = egitimDonemleri[0].donemler;
  //console.log(menuItems);
    //    var catShortName = egitimDonemleri[0].short_name;
  for (var i = 0; i < 2; i++)
  {
      if(egitimDonemleri[i].short_name.includes(egitimName))
      {
          menuItems = egitimDonemleri[i].donemler;
      }
  }
   
    var catShortName = egitimName;
  //   console.log(catShortName);
  
  for (var i = 0; i < menuItems.length; i++) {
      // Insert menu item values
      
            var html = donemHtml;
    html =
      insertProperty(html, "short_name", menuItems[i].short_name); 
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
      insertProperty(html,
                     "name",
                     menuItems[i].name);


    // Add clearfix after every second menu item
    if (i % 2 != 0) {
      html +=
        "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;
 
  }

  finalHtml += "</section>";
  return finalHtml;
}

function sinifAyarlaGoster(siniflar) {
    $ajaxUtils.sendGetRequest(
  sinifTitleHtml,
  function (sinifTitleHtml) {
      // Retrieve single menu item snippet
      $ajaxUtils.sendGetRequest(
        sinifHtml,
        function (sinifHtml) {

            var sinifGoruntule =
              sinifAyarlaGoruntule(siniflar,
                                     sinifTitleHtml,
                                     sinifHtml);
            insertHtml("#main-content", sinifGoruntule);
        },
        false);
  },
  false);
}

function sinifAyarlaGoruntule(siniflar,
                                sinifTitleHtml,
                                sinifHtml) {

    sinifTitleHtml =
      insertProperty(sinifTitleHtml,
                     "name",
                     siniflar.short_name);

    var finalHtml = sinifTitleHtml;
    finalHtml += "<section class='row'>";

    //  var menuItems = siniflar[0].donemler[0].sinif;
    // console.log(siniflar);
    var menuItems;
    for (var i = 0; i < 2; i++) {
        
            if (siniflar[0].donemler[i].short_name.includes(donemName)) {
                menuItems = siniflar[0].donemler[i].sinif;
                
                
            }
        
    }
    var catShortName = egitimName;
    var donemShortName = donemName;
    
    //var id = menuItem[i].id;

    //   console.log(catShortName);

    for (var i = 0; i < menuItems.length; i++) {
        // Insert menu item values
      
        var html = sinifHtml;
        html =
          insertProperty(html, "id", menuItems[i].id);
        html =
          insertProperty(html,
                         "catShortName",
                         catShortName);
        html =
  insertProperty(html,
                 "donemShortName",
                 donemShortName);
        html =
          insertProperty(html,
                         "name",
                         menuItems[i].name);


        // Add clearfix after every second menu item
        if (i % 2 != 0) {
            html +=
              "<div class='clearfix visible-lg-block visible-md-block'></div>";
        }

        finalHtml += html;

    }

    finalHtml += "</section>";
    return finalHtml;


}

function programAyarlaGoster(programlar) {
    $ajaxUtils.sendGetRequest(
programTitleHtml,
function (programTitleHtml) {
    // Retrieve single menu item snippet
    $ajaxUtils.sendGetRequest(
      programHtml,
      function (programHtml) {

          var programGoruntule =
            programAyarlaGoruntule(programlar,
                                   programTitleHtml,
                                   programHtml);
          insertHtml("#main-content", programGoruntule);
      },
      false);
},
false);
}

function programAyarlaGoruntule(programlar,
                                programTitleHtml,
                                programHtml) {

    programTitleHtml =
      insertProperty(programTitleHtml,
                     "name",
                     programlar.short_name);

    var finalHtml = programTitleHtml;
    finalHtml += "<section class='row'>";

    //  var menuItems = siniflar[0].donemler[0].sinif;
    // console.log(siniflar);
    var menuItems;
    
        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 4; j++) {
            if (programlar[0].donemler[i].sinif[j].program.includes(sinifNum)) {
                menuItems = programlar[0].donemler[i].sinif[j];
      
            }
          }
        }
    
    var catShortName = egitimName;
    var donemShortName = donemName;
    var sinifShortNum = sinifNum;
    //var id = menuItem[i].id;

    //   console.log(catShortName);
    

        // Insert menu item values
        var html = programHtml;
        html =
          insertProperty(html, "program", menuItems.program);
        html =
          insertProperty(html,
                         "catShortName",
                         catShortName);
        html =
  insertProperty(html,
                 "donemShortName",
                 donemShortName);
        html =
  insertProperty(html,
                 "sinifShortNum",
                 sinifShortNum);
        html =
          insertProperty(html,
                         "name",
                         menuItems.name);


        // Add clearfix after every second menu item
        if (i % 2 != 0) {
            html +=
              "<div class='clearfix visible-lg-block visible-md-block'></div>";
        }

        finalHtml += html;

    

    finalHtml += "</section>";
    return finalHtml;


}

function program2AyarlaGoster(programlar) {
    $ajaxUtils.sendGetRequest(
program2TitleHtml,
function (program2TitleHtml) {
    // Retrieve single menu item snippet
    $ajaxUtils.sendGetRequest(
      program2Html,
      function (program2Html) {

          var program2Goruntule =
            program2AyarlaGoruntule(programlar,
                                   program2TitleHtml,
                                   program2Html);
          insertHtml("#main-content", program2Goruntule);
      },
      false);
},
false);
}

function program2AyarlaGoruntule(programlar,
                                program2TitleHtml,
                                program2Html) {

    program2TitleHtml =
      insertProperty(program2TitleHtml,
                     "name",
                     programlar.short_name);

    var finalHtml = program2TitleHtml;
    finalHtml += "<section class='row'>";

    //  var menuItems = siniflar[0].donemler[0].sinif;
    // console.log(siniflar);
    var menuItems;

        for (var i = 0; i < 2; i++) {
            if (programlar[1].donemler[i].program.includes(donemName)) {
                menuItems = programlar[1].donemler[i];
            }
        }
    

    var catShortName = egitimName;
    var donemShortName = donemName;
    //var id = menuItem[i].id;

    //   console.log(catShortName);


    // Insert menu item values
    var html = program2Html;
    html =
      insertProperty(html, "program", menuItems.program);
    html =
      insertProperty(html,
                     "catShortName",
                     catShortName);
    html =
insertProperty(html,
             "donemShortName",
             donemShortName);

    html =
      insertProperty(html,
                     "name",
                     menuItems.name);


    // Add clearfix after every second menu item
    if (i % 2 != 0) {
        html +=
          "<div class='clearfix visible-lg-block visible-md-block'></div>";
    }

    finalHtml += html;



    finalHtml += "</section>";
    return finalHtml;


}

function personelAyarlaGoster(personeller) {
    $ajaxUtils.sendGetRequest(
        personelTitleHtml,
        function (personelTitleHtml) {
            // Retrieve single category snippet
            $ajaxUtils.sendGetRequest(
                personelHtml,
                function (personelHtml) {

                    var personelGoruntule =
                        personelAyarlaGoruntule(personeller,
                            personelTitleHtml,
                            personelHtml);
                    insertHtml("#main-content", personelGoruntule);
                },
                false);
        },
        false);
}

function personelAyarlaGoruntule(personeller,
    personelTitleHtml,
    personelHtml) {

    var finalHtml = personelTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over categories
    for (var i = 0; i < personeller.length; i++) {
        // Insert category values
        var html = personelHtml;
        var name = "" + personeller[i].name;
        var short_name = personeller[i].short_name;
        html =
            insertProperty(html, "name", name);
        html =
            insertProperty(html,
                "short_name",
                short_name);
        finalHtml += html;
    }

    finalHtml += "</section>";
    return finalHtml;
}
function personelBilgiAyarlaGoster(bilgiler) {
    $ajaxUtils.sendGetRequest(
        personelBilgiTitleHtml,
        function (personelBilgiTitleHtml) {
            // Retrieve single menu item snippet
            $ajaxUtils.sendGetRequest(
                personelBilgiHtml,
                function (personelBilgiHtml) {

                    var bilgiGoruntule =
                        personelBilgiAyarlaGoruntule(bilgiler,
                            personelBilgiTitleHtml,
                            personelBilgiHtml);
                    insertHtml("#main-content", bilgiGoruntule);
                },
                false);
        },
        false);
}
function personelBilgiAyarlaGoruntule(bilgiler,
                                    personelBilgiTitleHtml,
                                    personelBilgiHtml) {

    personelBilgiTitleHtml =
        insertProperty(personelBilgiTitleHtml,
            "name",
            bilgiler.name);
    /*menuItemsTitleHtml =
      insertProperty(menuItemsTitleHtml,
                     "special_instructions",
                     categoryMenuItems.category.special_instructions);*/

    var finalHtml = personelBilgiTitleHtml;
    finalHtml += "<section class='row'>";

    // Loop over menu items

    var menuItems;
    // var menuItems = egitimDonemleri[0].donemler;
    //console.log(menuItems);
    //    var catShortName = egitimDonemleri[0].short_name;
    for (var i = 0; i < 3; i++) {
        if (bilgiler[i].short_name.includes(personelName)) {
            menuItems = bilgiler[i].personeller;
        }
    }

    var catShortName = personelName;
    //   console.log(catShortName);

    for (var i = 0; i < menuItems.length; i++) {
        // Insert menu item values

        var html = personelBilgiHtml;
        html =
            insertProperty(html,
                "short_name",
                menuItems[i].short_name);
        html =
            insertProperty(html,
                "catShortName",
                catShortName);
        html =
            insertProperty(html,
                "isim",
                menuItems[i].isim);
        html =
            insertProperty(html,
                "email",
                menuItems[i].email);
        html =
            insertProperty(html,
                "gorev",
                menuItems[i].gorev);
        html =
            insertProperty(html,
                "unvan",
                menuItems[i].unvan);



        // Add clearfix after every second menu item
        if (i % 2 != 0) {
            html +=
                "<div class='clearfix visible-lg-block visible-md-block'></div>";
        }

        finalHtml += html;

    }

    finalHtml += "</section>";
    return finalHtml;
}

// Appends price with '$' if price exists
function insertItemPrice(html,
                         pricePropName,
                         priceValue) {
  // If not specified, replace with empty string
  if (!priceValue) {
    return insertProperty(html, pricePropName, "");;
  }

  priceValue = "$" + priceValue.toFixed(2);
  html = insertProperty(html, pricePropName, priceValue);
  return html;
}


// Appends portion name in parens if it exists
function insertItemPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


global.$dc = dc;

})(window);
