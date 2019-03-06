'use strict';

// Wrap everything in an anonymous function to avoid polluting the global namespace
(function () {
  let unregisterHandlerFunctions = [];

  // Use the jQuery document ready signal to know when everything has been initialized
  $(document).ready(function () {
    // Tell Tableau we'd like to initialize our extension
    tableau.extensions.initializeAsync().then(function () {
      showDetails();
    });
  });

  //Shows the choose sheet UI. Once a sheet is selected, the data table for the sheet is shown/
  function showDetails() {
    // Whenever we restore the filters table, remove all save handling functions,
    // since we add them back later in this function.
    unregisterHandlerFunctions.forEach(function (unregisterHandlerFunction) {
      unregisterHandlerFunction();
    });

    // Since filter info is attached to the worksheet, we will perform
    // one async call per worksheet to get every filter used in this
    // dashboard.  This demonstrates the use of Promise.all to combine
    // promises together and wait for each of them to resolve.
    let filterfp = [];

    // List of all filters in a dashboard.
    let dashfilters = [];

    // Get the dashboard object
    const dashboard = tableau.extensions.dashboardContent.dashboard;
    var dashname = dashboard.name;
    //alert('Lets empty the text ...');
    $('#dashboard_details').html('');

    var hdr = '<h4>Dashboard ... <span class="extension_dashboard">'+ dashname +'</span></h4>';
    
    $(hdr).appendTo('#dashboard_details');
    
    //alert(dashname);
    // The first step in choosing a sheet will be asking Tableau what sheets are available
    const worksheets = dashboard.worksheets;
    // Next, we loop through all of these worksheets and pop an alert with it's name
    $('<b><u>Worksheets on Dashboard</u></b><br>').appendTo('#dashboard_details');
    worksheets.forEach(function (worksheet) {
      // For now, just pop up an alert saying that we've selected a sheet
      var wsname = worksheet.name;
      var sheetstr = '<div>Sheet - ' + wsname + '<br></div>';
      $(sheetstr).appendTo('#dashboard_details');

      //Add the filter details to the filterfp array
      filterfp.push(worksheet.getFiltersAsync());

      // Add filter event to each worksheet.  AddEventListener returns a function that will
      // remove the event listener when called.
      let unregisterHandlerFunction = worksheet.addEventListener(tableau.TableauEventType.FilterChanged, filterChangedHandler);
      unregisterHandlerFunctions.push(unregisterHandlerFunction);
    });

    var filterhdrstr = '<br><b><u>Filters Used on Dashboard</u></b><br>';
    $(filterhdrstr).appendTo('#dashboard_details');
    // Now, we call every filter fetch promise, and wait for all the results
    // to finish before displaying the results to the user.
    Promise.all(filterfp).then(function (filtersfetch) {
      filtersfetch.forEach(function (filterswsfilters) {
        filterswsfilters.forEach(function (filter) {
          dashfilters.push(filter);
        });
      });

      dashfilters.forEach(function (filter){
        var filterstr = getFilterValues(filter);
        var extfilterstr = '<div>Filter - ' + filterstr + '<br></div>';
        $(extfilterstr).appendTo('#dashboard_details');
      });
    });
  }

  // This is a handling function that is called anytime a filter is changed in Tableau.
  function filterChangedHandler (filterEvent) {
    // Just reconstruct the filters table whenever a filter changes.
    // This could be optimized to add/remove only the different filters.
    showDetails();
  }

  // This returns a string representation of the values a filter is set to.
  // Depending on the type of filter, this string will take a different form.
  function getFilterValues (filter) {
    let filterValues = '';
    filterValues += filter.
    filterValues += filter.worksheetName + ' - ';
    filterValues += filter.fieldName + ' - ';
    switch (filter.filterType) {
      case 'categorical':
        filter.appliedValues.forEach(function (value) {
          filterValues += value.formattedValue + ', ';
        });
        break;
      case 'range':
        // A range filter can have a min and/or a max.
        if (filter.minValue) {
          filterValues += 'min: ' + filter.minValue.formattedValue + ', ';
        }

        if (filter.maxValue) {
          filterValues += 'min: ' + filter.maxValue.formattedValue + ', ';
        }
        break;
      case 'relative-date':
        filterValues += 'Period: ' + filter.periodType + ', ';
        filterValues += 'RangeN: ' + filter.rangeN + ', ';
        filterValues += 'Range Type: ' + filter.rangeType + ', ';
        break;
      default:
    }

    // Cut off the trailing ", "
    return filterValues.slice(0, -2);
  }  
})();