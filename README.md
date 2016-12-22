# jquery.maskedinput
A jQuery masked input control

* Support numeric parts, text, and predefined options
* Allows control (both css and js) on individual parts of the field
* Custom validators
* Many options

---

## Example

[https://rawgit.com/danielgindi/jquery.maskedinput/master/example/index.html](https://rawgit.com/danielgindi/jquery.maskedinput/master/example/index.html)

## Usage

Instantiate a new control:

```javascript
var input = new MaskedInput({
     format: '## "times a day on" dd MMM yy'
 });
input.$el.appendTo('#date4-field-cell');
input.resize(); // To cause an immediate resize of internal elements before DOM is rendered
```

Getting the full value:
```javascript
alert( input.value() ); // .val() will also work
```

Setting the full value:
```javascript
alert( input.value('5 times a day on 5 Dec 08') ); // .val() will also work
```

## Api

#### Methods

* `.field(index)` - Get an internal field element by index or by name. 
* `.fieldOption(name, newValue?)` - Get/set a field's configuration option (See `MaskedInput~Part` for available options)
* `.fieldValue(index, newValue?)` - Get/set an internal field's value by index or by name. 
* `.option(name, newValue?)` - Get/set a configuration option 
* `.render()` - Call if something has drastically changed and the control needs to be regenerated. Only applicable when you've manually changed a field's type.
* `.resize()` - Update the size of the field's content. This can't be called when the control is not on the DOM yet.
  If you don't want the field to be dynamically sized, you can skip calling this.
* `.val(newValue?)` - A synonym for `value`
* `.value(newValue?)` - Get/set the full value

#### MaskedInput~Options

* `format: String` - The format to use. This is the most important thing here.
* `patterns: Object<String, MaskedInput~Pattern>` - Additional patterns to recognize in the format

#### MaskedInput~PartType

You can access these value through `MaskedInput.PartType`.

* `NUMBER = 'number'` - A numeric field
* `TEXT = 'text'` - A textual field (possibly with pre-defined options)
* `LABEL = 'label'` - A label - this is the readonly text that appears between fields

#### MaskedInput~Part

* `type: MaskedInput~PartType` - Type of the field
* `name: String` - Name for this field
* `ariaLabel: String` - An ARIA accessibility label
* `text: String` - Text for this field if it's a `LABEL`
* `placeholder: String` - Placeholder for the field
* `length: Number` - The length, in characters, of the field. `0` means "any length". Applicable for both numberic and textual field.
* `maxLength: Number` - The maximum length, in characters, of the field.
* `numericMin: Number` - Minimum numeric value
* `numericMax: Number` - Maximum numeric value
* `validator: RegExp|String|function(value:String)` - Validator regex or function
* `options: String[]` - Array of pre-defined `String` options for a textual field.
* `postProcess: function(value,type:MaskedInput~Part)` - Function for post processing a value before retrieving by user
* `padding: Number|Boolean` - Enable (or specify minimum) padding in value result (default `true`)
* `required: Boolean` - Is the field required (default `true`)
* `defaultValue: String` - Default value, used if field is not `required`
* `forcePlaceholderWidth: String` - Always consider placeholder's width (default `true`)

#### `MaskedInput~Pattern` <sup>(inherits `MaskedInput~Part`)</sup> 

* `pattern: RegExp|String` - Specifies the regex pattern to look for in the format

All `MaskedInput~Part` options (except `validator` and `postProcess`) can be specified in the `MaskedInput~Pattern` as they are, or as a function that returns the value.  
If a function is specified, then it receives the regex match in the arguments.
i.e. `length: 2`, vs. `length: function (match) { return match.length }`.

## Date plugin

In the `jquery.maskedinput.full.js`, the date plugin is bundled by deafult.  
It adds patterns for date/time parts d/dd/M/MM/MMM/MMMM/yy/yyyy/H/HH/h/hh/m/mm/s/ss/t/tt/T/TT.

You can localize the relevant date parts by passing in a `dateLocale` option.
```
var input = new MaskedInput({
    format: 'dd MMMM yy, hh:mm tt',
    
    /* This is the default dateLocale: */
    dateLocale: {
        MMM: [
            'Jan', 'Feb', 'Mar',
            'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep',
            'Oct', 'Nov', 'Dec'
        ],
        MMMM: [
            'January', 'February', 'March',
            'April', 'May', 'June',
            'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        t: ['a', 'p'],
        tt: ['am', 'pm'],
        T: ['A', 'P'],
        TT: ['AM', 'PM'],
        aria: {
            day: 'Day',
            month: 'Month',
            year: 'Year',
            hour: 'Hour',
            minutes: 'Minutes',
            seconds: 'Seconds',
            meridiem: 'Am/Pm'
        }
    }
});
```

### Extending

If you want to extend the MaskedInput for more patterns globally, you can push extensions to `MaskedInput.MaskedInput.patternAddons`.  
Each extension is a dictionary of `String : MaskedInput~Pattern`, where the key is a name for easy access and configuration, which has not meaning to MaskedInput itself.

You can also access and modify the default options, through `MaskedInput.defaults`.

## Me
* Hi! I am Daniel Cohen Gindi. Or in short- Daniel.
* danielgindi@gmail.com is my email address.
* That's all you need to know.

## Help

I have invested, and investing, a lot of time in this project.
If you want to help, you could:
* Actually code, and issue pull requests
* Test the library under different conditions and browsers
* Create more demo pages
* Spread the word
* 
[![Donate](https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=45T5QNATLCPS2)


## License

All the code here is under MIT license. Which means you could do virtually anything with the code.
I will appreciate it very much if you keep an attribution where appropriate.

    The MIT License (MIT)
    
    Copyright (c) 2013 Daniel Cohen Gindi (danielgindi@gmail.com)
    
    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:
    
    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.
    
    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
