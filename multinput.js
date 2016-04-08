/*******************************************
* multinput.js
* Copyright (c) 2015, Darrel Kathan 
* Licensed under the MIT license.
*
* A current version and some documentation is available at
*    https://github.com/kathan/js-cgi
*
* @summary     Multinput Facebook style multi-select input widget.
* @description Multinput Facebook style multi-select input widget.
* @file        multinput.js
* @version     1.0
* @author      Darrel Kathan
* @license     MIT
*******************************************/
(function($) {
  var methods = {
    init: function(options) {
      $(this).data('options', options);
      return this.each(function() {
        var thisObj = this;
        options.split ? this.split = options.split : this.split = /[,;\n\t]/;
        if (!$(this).hasClass('multinput-init')) {
          var cont = $('<div style="background-color:white;border:1px solid gray;margin:3px"></div>').insertAfter(this);

          $(this).appendTo(cont);
          $(this).attr('multiple', 'multiple');
          //Move the select off screen
          $(this).css('display', 'none');
         
          var ul = $('<ul style="margin:0px;padding:0px;list-style:none;"></ul>').insertBefore(this),
              li = $('<li></li>').appendTo(ul),
              input;
          if (!$(this).prop('disabled')) {
            input = $('<textarea class="ui-widget" style="display:inline;border:none;resize:none;overflow:auto"></textarea>').appendTo(li);

            cont.click(function(e) {
              input.focus();
              e.stopPropagation();
            });
            $(thisObj).change(function(e) {
              $(thisObj).find('option').each(function(i, o) {
                $(o).prop('selected', 'selected');
              });
            });
            input.on("paste", function(e) {
              var to = window.setTimeout(function() {
                var data = input.val().split(thisObj.split);
                window.clearTimeout(to);
                $(thisObj).trigger({
                  type: "paste",
                  pastedData: data
                });
                input.val('');
              }, 0);
            });
            input.autocomplete($(this).data('options'));
            input.css('height', '20px');
          } else {
            input = $('<div style="clear:both;display:block;border:none;resize:none;overflow:auto"></div>').appendTo(li);
          }
          input.data('multinput', this);


          $(this).data('input', input);
          $(this).data('list', ul);
          $(this).addClass('multinput-init');
          $(this).find('option').each(function(i, o) {
            $(thisObj).multinput('addListItem', o).addClass('multinput-good');
          });
        }
      });
    },
    addListItem: function(opt) {
      var list = $(this).data('list'),
      	  self = this,
      	  li = $('<li class="multinput-li"></li>').prependTo(list);
      li.data('option', opt);

      if (!$(this).prop('disabled')) {
        $('<span class="remove">x</span>').appendTo(li)
          .click(function(event) {

            $(opt).remove();
            $(li).remove();
            self.trigger('deleted', li);
            event.stopPropagation();
            return false;
          });
      } else {
        $('<span>-</span>').appendTo(li);
      }
      $('<p>' + $(opt).text() + '</p>').appendTo(li);
      return li;
    },

    add: function(obj) {
      var opt = $('<option value="' + obj.id + '" selected="selected">' + obj.name + '</option>').appendTo(this);

      var li = this.multinput('addListItem', opt);
      $(this).trigger('change');
      $(this).find('option').each(function(i, o) {
        $(o).prop('selected', 'selected');
      });
      return li;
    }
  };


  $.fn.multinput = function(method) {
    if (methods[method]) {
      return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
    } else {
      return methods.init.apply(this, arguments);
    }
  };
}(jQuery));
