(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (Object.prototype.hasOwnProperty.call(value, key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	var unwrapped = _Json_unwrap(value);
	if (!(key === 'toJSON' && typeof unwrapped === 'function'))
	{
		object[key] = unwrapped;
	}
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'outerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (
		(typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		||
		(Array.isArray(_Json_unwrap(value)) && _VirtualDom_RE_js_html.test(String(_Json_unwrap(value))))
	)
		? _Json_wrap(
			/**_UNUSED/''//*//**/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



// DECODER

var _File_decoder = _Json_decodePrim(function(value) {
	// NOTE: checks if `File` exists in case this is run on node
	return (typeof File !== 'undefined' && value instanceof File)
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FILE', value);
});


// METADATA

function _File_name(file) { return file.name; }
function _File_mime(file) { return file.type; }
function _File_size(file) { return file.size; }

function _File_lastModified(file)
{
	return $elm$time$Time$millisToPosix(file.lastModified);
}


// DOWNLOAD

var _File_downloadNode;

function _File_getDownloadNode()
{
	return _File_downloadNode || (_File_downloadNode = document.createElement('a'));
}

var _File_download = F3(function(name, mime, content)
{
	return _Scheduler_binding(function(callback)
	{
		var blob = new Blob([content], {type: mime});

		// for IE10+
		if (navigator.msSaveOrOpenBlob)
		{
			navigator.msSaveOrOpenBlob(blob, name);
			return;
		}

		// for HTML5
		var node = _File_getDownloadNode();
		var objectUrl = URL.createObjectURL(blob);
		node.href = objectUrl;
		node.download = name;
		_File_click(node);
		URL.revokeObjectURL(objectUrl);
	});
});

function _File_downloadUrl(href)
{
	return _Scheduler_binding(function(callback)
	{
		var node = _File_getDownloadNode();
		node.href = href;
		node.download = '';
		node.origin === location.origin || (node.target = '_blank');
		_File_click(node);
	});
}


// IE COMPATIBILITY

function _File_makeBytesSafeForInternetExplorer(bytes)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/10
	// all other browsers can just run `new Blob([bytes])` directly with no problem
	//
	return new Uint8Array(bytes.buffer, bytes.byteOffset, bytes.byteLength);
}

function _File_click(node)
{
	// only needed by IE10 and IE11 to fix https://github.com/elm/file/issues/11
	// all other browsers have MouseEvent and do not need this conditional stuff
	//
	if (typeof MouseEvent === 'function')
	{
		node.dispatchEvent(new MouseEvent('click'));
	}
	else
	{
		var event = document.createEvent('MouseEvents');
		event.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
		document.body.appendChild(node);
		node.dispatchEvent(event);
		document.body.removeChild(node);
	}
}


// UPLOAD

var _File_node;

function _File_uploadOne(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			callback(_Scheduler_succeed(event.target.files[0]));
		});
		_File_click(_File_node);
	});
}

function _File_uploadOneOrMore(mimes)
{
	return _Scheduler_binding(function(callback)
	{
		_File_node = document.createElement('input');
		_File_node.type = 'file';
		_File_node.multiple = true;
		_File_node.accept = A2($elm$core$String$join, ',', mimes);
		_File_node.addEventListener('change', function(event)
		{
			var elmFiles = _List_fromArray(event.target.files);
			callback(_Scheduler_succeed(_Utils_Tuple2(elmFiles.a, elmFiles.b)));
		});
		_File_click(_File_node);
	});
}


// CONTENT

function _File_toString(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsText(blob);
		return function() { reader.abort(); };
	});
}

function _File_toBytes(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(new DataView(reader.result)));
		});
		reader.readAsArrayBuffer(blob);
		return function() { reader.abort(); };
	});
}

function _File_toUrl(blob)
{
	return _Scheduler_binding(function(callback)
	{
		var reader = new FileReader();
		reader.addEventListener('loadend', function() {
			callback(_Scheduler_succeed(reader.result));
		});
		reader.readAsDataURL(blob);
		return function() { reader.abort(); };
	});
}



// BYTES

function _Bytes_width(bytes)
{
	return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function(le, be)
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be));
	});
});


// ENCODERS

function _Bytes_encode(encoder)
{
	var mutableBytes = new DataView(new ArrayBuffer($elm$bytes$Bytes$Encode$getWidth(encoder)));
	$elm$bytes$Bytes$Encode$write(encoder)(mutableBytes)(0);
	return mutableBytes;
}


// SIGNED INTEGERS

var _Bytes_write_i8  = F3(function(mb, i, n) { mb.setInt8(i, n); return i + 1; });
var _Bytes_write_i16 = F4(function(mb, i, n, isLE) { mb.setInt16(i, n, isLE); return i + 2; });
var _Bytes_write_i32 = F4(function(mb, i, n, isLE) { mb.setInt32(i, n, isLE); return i + 4; });


// UNSIGNED INTEGERS

var _Bytes_write_u8  = F3(function(mb, i, n) { mb.setUint8(i, n); return i + 1 ;});
var _Bytes_write_u16 = F4(function(mb, i, n, isLE) { mb.setUint16(i, n, isLE); return i + 2; });
var _Bytes_write_u32 = F4(function(mb, i, n, isLE) { mb.setUint32(i, n, isLE); return i + 4; });


// FLOATS

var _Bytes_write_f32 = F4(function(mb, i, n, isLE) { mb.setFloat32(i, n, isLE); return i + 4; });
var _Bytes_write_f64 = F4(function(mb, i, n, isLE) { mb.setFloat64(i, n, isLE); return i + 8; });


// BYTES

var _Bytes_write_bytes = F3(function(mb, offset, bytes)
{
	for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4)
	{
		mb.setUint32(offset + i, bytes.getUint32(i));
	}
	for (; i < len; i++)
	{
		mb.setUint8(offset + i, bytes.getUint8(i));
	}
	return offset + len;
});


// STRINGS

function _Bytes_getStringWidth(string)
{
	for (var width = 0, i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		width +=
			(code < 0x80) ? 1 :
			(code < 0x800) ? 2 :
			(code < 0xD800 || 0xDBFF < code) ? 3 : (i++, 4);
	}
	return width;
}

var _Bytes_write_string = F3(function(mb, offset, string)
{
	for (var i = 0; i < string.length; i++)
	{
		var code = string.charCodeAt(i);
		offset +=
			(code < 0x80)
				? (mb.setUint8(offset, code)
				, 1
				)
				:
			(code < 0x800)
				? (mb.setUint16(offset, 0xC080 /* 0b1100000010000000 */
					| (code >>> 6 & 0x1F /* 0b00011111 */) << 8
					| code & 0x3F /* 0b00111111 */)
				, 2
				)
				:
			(code < 0xD800 || 0xDBFF < code)
				? (mb.setUint16(offset, 0xE080 /* 0b1110000010000000 */
					| (code >>> 12 & 0xF /* 0b00001111 */) << 8
					| code >>> 6 & 0x3F /* 0b00111111 */)
				, mb.setUint8(offset + 2, 0x80 /* 0b10000000 */
					| code & 0x3F /* 0b00111111 */)
				, 3
				)
				:
			(code = (code - 0xD800) * 0x400 + string.charCodeAt(++i) - 0xDC00 + 0x10000
			, mb.setUint32(offset, 0xF0808080 /* 0b11110000100000001000000010000000 */
				| (code >>> 18 & 0x7 /* 0b00000111 */) << 24
				| (code >>> 12 & 0x3F /* 0b00111111 */) << 16
				| (code >>> 6 & 0x3F /* 0b00111111 */) << 8
				| code & 0x3F /* 0b00111111 */)
			, 4
			);
	}
	return offset;
});


// DECODER

var _Bytes_decode = F2(function(decoder, bytes)
{
	try {
		return $elm$core$Maybe$Just(A2(decoder, bytes, 0).b);
	} catch(e) {
		return $elm$core$Maybe$Nothing;
	}
});

var _Bytes_read_i8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getInt8(offset)); });
var _Bytes_read_i16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getInt16(offset, isLE)); });
var _Bytes_read_i32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getInt32(offset, isLE)); });
var _Bytes_read_u8  = F2(function(      bytes, offset) { return _Utils_Tuple2(offset + 1, bytes.getUint8(offset)); });
var _Bytes_read_u16 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 2, bytes.getUint16(offset, isLE)); });
var _Bytes_read_u32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getUint32(offset, isLE)); });
var _Bytes_read_f32 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 4, bytes.getFloat32(offset, isLE)); });
var _Bytes_read_f64 = F3(function(isLE, bytes, offset) { return _Utils_Tuple2(offset + 8, bytes.getFloat64(offset, isLE)); });

var _Bytes_read_bytes = F3(function(len, bytes, offset)
{
	return _Utils_Tuple2(offset + len, new DataView(bytes.buffer, bytes.byteOffset + offset, len));
});

var _Bytes_read_string = F3(function(len, bytes, offset)
{
	var string = '';
	var end = offset + len;
	for (; offset < end;)
	{
		var byte = bytes.getUint8(offset++);
		string +=
			(byte < 128)
				? String.fromCharCode(byte)
				:
			((byte & 0xE0 /* 0b11100000 */) === 0xC0 /* 0b11000000 */)
				? String.fromCharCode((byte & 0x1F /* 0b00011111 */) << 6 | bytes.getUint8(offset++) & 0x3F /* 0b00111111 */)
				:
			((byte & 0xF0 /* 0b11110000 */) === 0xE0 /* 0b11100000 */)
				? String.fromCharCode(
					(byte & 0xF /* 0b00001111 */) << 12
					| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
					| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
				)
				:
				(byte =
					((byte & 0x7 /* 0b00000111 */) << 18
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 12
						| (bytes.getUint8(offset++) & 0x3F /* 0b00111111 */) << 6
						| bytes.getUint8(offset++) & 0x3F /* 0b00111111 */
					) - 0x10000
				, String.fromCharCode(Math.floor(byte / 0x400) + 0xD800, byte % 0x400 + 0xDC00)
				);
	}
	return _Utils_Tuple2(offset, string);
});

var _Bytes_decodeFailure = F2(function() { throw 0; });



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Main$BytesLoaded = function (a) {
	return {$: 'BytesLoaded', a: a};
};
var $author$project$Main$EngineMsg = function (a) {
	return {$: 'EngineMsg', a: a};
};
var $author$project$Main$FileChosen = function (a) {
	return {$: 'FileChosen', a: a};
};
var $techbelly$elm_zengine$ZEngine$apply = F3(
	function (merge, model, step) {
		return _Utils_Tuple2(
			A3(merge, step.session, step.error, model),
			step.cmd);
	});
var $techbelly$elm_zengine$ZEngine$AutoChar = function (a) {
	return {$: 'AutoChar', a: a};
};
var $techbelly$elm_zengine$ZEngine$DeclineRestore = {$: 'DeclineRestore'};
var $techbelly$elm_zengine$ZEngine$DeclineSave = {$: 'DeclineSave'};
var $techbelly$elm_zengine$ZEngine$defaultConfig = {
	onCharPrompt: $techbelly$elm_zengine$ZEngine$AutoChar(
		_Utils_chr(' ')),
	onRestorePrompt: $techbelly$elm_zengine$ZEngine$DeclineRestore,
	onSavePrompt: $techbelly$elm_zengine$ZEngine$DeclineSave
};
var $elm$time$Time$Posix = function (a) {
	return {$: 'Posix', a: a};
};
var $elm$time$Time$millisToPosix = $elm$time$Time$Posix;
var $elm$file$File$Select$file = F2(
	function (mimes, toMsg) {
		return A2(
			$elm$core$Task$perform,
			toMsg,
			_File_uploadOne(mimes));
	});
var $techbelly$elm_zengine$ZEngine$errorMessage = function (err) {
	switch (err.$) {
		case 'LoadError':
			var msg = err.a;
			return msg;
		case 'RestoreError':
			var msg = err.a;
			return msg;
		default:
			var msg = err.a;
			return msg;
	}
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $author$project$Main$mergeEngine = F3(
	function (session, error, model) {
		return _Utils_update(
			model,
			{
				error: A2($elm$core$Maybe$map, $techbelly$elm_zengine$ZEngine$errorMessage, error),
				session: session
			});
	});
var $techbelly$elm_zengine$ZEngine$Session = function (a) {
	return {$: 'Session', a: a};
};
var $techbelly$elm_zengine$ZEngine$Internal$Loading = {$: 'Loading'};
var $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput = {statusLine: $elm$core$Maybe$Nothing, text: ''};
var $techbelly$elm_zengine$ZEngine$initialState = F3(
	function (config, machine, bytes) {
		return {activePrompt: $elm$core$Maybe$Nothing, config: config, currentStatusLine: $elm$core$Maybe$Nothing, inputQueue: _List_Nil, machine: machine, pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput, phase: $techbelly$elm_zengine$ZEngine$Internal$Loading, restoringSession: false, storyBytes: bytes, storyName: '', titleEmitted: false, transcript: _List_Nil, turnHistory: _List_Nil};
	});
var $techbelly$elm_zmachine$ZMachine$Memory$Memory = function (a) {
	return {$: 'Memory', a: a};
};
var $elm$bytes$Bytes$BE = {$: 'BE'};
var $elm$bytes$Bytes$Encode$getWidth = function (builder) {
	switch (builder.$) {
		case 'I8':
			return 1;
		case 'I16':
			return 2;
		case 'I32':
			return 4;
		case 'U8':
			return 1;
		case 'U16':
			return 2;
		case 'U32':
			return 4;
		case 'F32':
			return 4;
		case 'F64':
			return 8;
		case 'Seq':
			var w = builder.a;
			return w;
		case 'Utf8':
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $elm$bytes$Bytes$LE = {$: 'LE'};
var $elm$bytes$Bytes$Encode$write = F3(
	function (builder, mb, offset) {
		switch (builder.$) {
			case 'I8':
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 'I16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'I32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_i32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U8':
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 'U16':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u16,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'U32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_u32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F32':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f32,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'F64':
				var e = builder.a;
				var n = builder.b;
				return A4(
					_Bytes_write_f64,
					mb,
					offset,
					n,
					_Utils_eq(e, $elm$bytes$Bytes$LE));
			case 'Seq':
				var bs = builder.b;
				return A3($elm$bytes$Bytes$Encode$writeSequence, bs, mb, offset);
			case 'Utf8':
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $elm$bytes$Bytes$Encode$writeSequence = F3(
	function (builders, mb, offset) {
		writeSequence:
		while (true) {
			if (!builders.b) {
				return offset;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$builders = bs,
					$temp$mb = mb,
					$temp$offset = A3($elm$bytes$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $elm$bytes$Bytes$Decode$decode = F2(
	function (_v0, bs) {
		var decoder = _v0.a;
		return A2(_Bytes_decode, decoder, bs);
	});
var $elm$bytes$Bytes$Decode$Decoder = function (a) {
	return {$: 'Decoder', a: a};
};
var $elm$bytes$Bytes$Decode$map2 = F3(
	function (func, _v0, _v1) {
		var decodeA = _v0.a;
		var decodeB = _v1.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v2 = A2(decodeA, bites, offset);
					var aOffset = _v2.a;
					var a = _v2.b;
					var _v3 = A2(decodeB, bites, aOffset);
					var bOffset = _v3.a;
					var b = _v3.b;
					return _Utils_Tuple2(
						bOffset,
						A2(func, a, b));
				}));
	});
var $elm$core$Tuple$pair = F2(
	function (a, b) {
		return _Utils_Tuple2(a, b);
	});
var $elm$bytes$Bytes$Decode$andThen = F2(
	function (callback, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var newOffset = _v1.a;
					var a = _v1.b;
					var _v2 = callback(a);
					var decodeB = _v2.a;
					return A2(decodeB, bites, newOffset);
				}));
	});
var $elm$bytes$Bytes$Decode$bytes = function (n) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_bytes(n));
};
var $techbelly$elm_zmachine$ZMachine$Memory$skipThenDecode = F2(
	function (n, decoder) {
		return A2(
			$elm$bytes$Bytes$Decode$andThen,
			function (_v0) {
				return decoder;
			},
			$elm$bytes$Bytes$Decode$bytes(n));
	});
var $elm$bytes$Bytes$Decode$unsignedInt16 = function (endianness) {
	return $elm$bytes$Bytes$Decode$Decoder(
		_Bytes_read_u16(
			_Utils_eq(endianness, $elm$bytes$Bytes$LE)));
};
var $elm$bytes$Bytes$Decode$unsignedInt8 = $elm$bytes$Bytes$Decode$Decoder(_Bytes_read_u8);
var $techbelly$elm_zmachine$ZMachine$Memory$decodeHeader = function (raw) {
	var decoder = A3(
		$elm$bytes$Bytes$Decode$map2,
		$elm$core$Tuple$pair,
		$elm$bytes$Bytes$Decode$unsignedInt8,
		A2(
			$techbelly$elm_zmachine$ZMachine$Memory$skipThenDecode,
			13,
			$elm$bytes$Bytes$Decode$unsignedInt16($elm$bytes$Bytes$BE)));
	return A2($elm$bytes$Bytes$Decode$decode, decoder, raw);
};
var $techbelly$elm_zmachine$ZMachine$Memory$V3 = {$: 'V3'};
var $techbelly$elm_zmachine$ZMachine$Memory$V5 = {$: 'V5'};
var $techbelly$elm_zmachine$ZMachine$Memory$makeProfile = function (ver) {
	if (ver.$ === 'V3') {
		return {childOffset: 6, dictWordWords: 2, dictWordZChars: 6, fileLengthMultiplier: 2, hasStatusLine: true, numAttributeBytes: 4, numPropertyDefaults: 31, objectEntrySize: 9, objectPointerSize: 1, packingShift: 1, parentOffset: 4, propPtrOffset: 7, propertyNumberMask: 31, routineHasInitialValues: true, siblingOffset: 5, textBufferOffset: 1, version: $techbelly$elm_zmachine$ZMachine$Memory$V3};
	} else {
		return {childOffset: 10, dictWordWords: 3, dictWordZChars: 9, fileLengthMultiplier: 4, hasStatusLine: false, numAttributeBytes: 6, numPropertyDefaults: 63, objectEntrySize: 14, objectPointerSize: 2, packingShift: 2, parentOffset: 6, propPtrOffset: 12, propertyNumberMask: 63, routineHasInitialValues: false, siblingOffset: 8, textBufferOffset: 2, version: $techbelly$elm_zmachine$ZMachine$Memory$V5};
	}
};
var $elm$bytes$Bytes$Decode$loopHelp = F4(
	function (state, callback, bites, offset) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var decoder = _v0.a;
			var _v1 = A2(decoder, bites, offset);
			var newOffset = _v1.a;
			var step = _v1.b;
			if (step.$ === 'Loop') {
				var newState = step.a;
				var $temp$state = newState,
					$temp$callback = callback,
					$temp$bites = bites,
					$temp$offset = newOffset;
				state = $temp$state;
				callback = $temp$callback;
				bites = $temp$bites;
				offset = $temp$offset;
				continue loopHelp;
			} else {
				var result = step.a;
				return _Utils_Tuple2(newOffset, result);
			}
		}
	});
var $elm$bytes$Bytes$Decode$loop = F2(
	function (state, callback) {
		return $elm$bytes$Bytes$Decode$Decoder(
			A2($elm$bytes$Bytes$Decode$loopHelp, state, callback));
	});
var $elm$bytes$Bytes$Decode$Done = function (a) {
	return {$: 'Done', a: a};
};
var $elm$bytes$Bytes$Decode$Loop = function (a) {
	return {$: 'Loop', a: a};
};
var $elm$core$Basics$ge = _Utils_ge;
var $elm$bytes$Bytes$Decode$map = F2(
	function (func, _v0) {
		var decodeA = _v0.a;
		return $elm$bytes$Bytes$Decode$Decoder(
			F2(
				function (bites, offset) {
					var _v1 = A2(decodeA, bites, offset);
					var aOffset = _v1.a;
					var a = _v1.b;
					return _Utils_Tuple2(
						aOffset,
						func(a));
				}));
	});
var $elm$core$Elm$JsArray$push = _JsArray_push;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $elm$core$Array$bitMask = 4294967295 >>> (32 - $elm$core$Array$shiftStep);
var $elm$core$Elm$JsArray$singleton = _JsArray_singleton;
var $elm$core$Elm$JsArray$unsafeGet = _JsArray_unsafeGet;
var $elm$core$Elm$JsArray$unsafeSet = _JsArray_unsafeSet;
var $elm$core$Array$insertTailInTree = F4(
	function (shift, index, tail, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		if (_Utils_cmp(
			pos,
			$elm$core$Elm$JsArray$length(tree)) > -1) {
			if (shift === 5) {
				return A2(
					$elm$core$Elm$JsArray$push,
					$elm$core$Array$Leaf(tail),
					tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, $elm$core$Elm$JsArray$empty));
				return A2($elm$core$Elm$JsArray$push, newSub, tree);
			}
		} else {
			var value = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (value.$ === 'SubTree') {
				var subTree = value.a;
				var newSub = $elm$core$Array$SubTree(
					A4($elm$core$Array$insertTailInTree, shift - $elm$core$Array$shiftStep, index, tail, subTree));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			} else {
				var newSub = $elm$core$Array$SubTree(
					A4(
						$elm$core$Array$insertTailInTree,
						shift - $elm$core$Array$shiftStep,
						index,
						tail,
						$elm$core$Elm$JsArray$singleton(value)));
				return A3($elm$core$Elm$JsArray$unsafeSet, pos, newSub, tree);
			}
		}
	});
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Array$unsafeReplaceTail = F2(
	function (newTail, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		var originalTailLen = $elm$core$Elm$JsArray$length(tail);
		var newTailLen = $elm$core$Elm$JsArray$length(newTail);
		var newArrayLen = len + (newTailLen - originalTailLen);
		if (_Utils_eq(newTailLen, $elm$core$Array$branchFactor)) {
			var overflow = _Utils_cmp(newArrayLen >>> $elm$core$Array$shiftStep, 1 << startShift) > 0;
			if (overflow) {
				var newShift = startShift + $elm$core$Array$shiftStep;
				var newTree = A4(
					$elm$core$Array$insertTailInTree,
					newShift,
					len,
					newTail,
					$elm$core$Elm$JsArray$singleton(
						$elm$core$Array$SubTree(tree)));
				return A4($elm$core$Array$Array_elm_builtin, newArrayLen, newShift, newTree, $elm$core$Elm$JsArray$empty);
			} else {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					newArrayLen,
					startShift,
					A4($elm$core$Array$insertTailInTree, startShift, len, newTail, tree),
					$elm$core$Elm$JsArray$empty);
			}
		} else {
			return A4($elm$core$Array$Array_elm_builtin, newArrayLen, startShift, tree, newTail);
		}
	});
var $elm$core$Array$push = F2(
	function (a, array) {
		var tail = array.d;
		return A2(
			$elm$core$Array$unsafeReplaceTail,
			A2($elm$core$Elm$JsArray$push, a, tail),
			array);
	});
var $elm$bytes$Bytes$Decode$succeed = function (a) {
	return $elm$bytes$Bytes$Decode$Decoder(
		F2(
			function (_v0, offset) {
				return _Utils_Tuple2(offset, a);
			}));
};
var $techbelly$elm_zmachine$Library$BytesExtra$step = F2(
	function (count, _v0) {
		var index = _v0.a;
		var acc = _v0.b;
		return (_Utils_cmp(index, count) > -1) ? $elm$bytes$Bytes$Decode$succeed(
			$elm$bytes$Bytes$Decode$Done(acc)) : A2(
			$elm$bytes$Bytes$Decode$map,
			function (_byte) {
				return $elm$bytes$Bytes$Decode$Loop(
					_Utils_Tuple2(
						index + 1,
						A2($elm$core$Array$push, _byte, acc)));
			},
			$elm$bytes$Bytes$Decode$unsignedInt8);
	});
var $techbelly$elm_zmachine$Library$BytesExtra$loopDecoder = function (count) {
	return A2(
		$elm$bytes$Bytes$Decode$loop,
		_Utils_Tuple2(0, $elm$core$Array$empty),
		$techbelly$elm_zmachine$Library$BytesExtra$step(count));
};
var $elm$bytes$Bytes$width = _Bytes_width;
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (maybe.$ === 'Just') {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $techbelly$elm_zmachine$Library$BytesExtra$toIntArray = function (raw) {
	var count = $elm$bytes$Bytes$width(raw);
	return A2(
		$elm$core$Maybe$withDefault,
		$elm$core$Array$empty,
		A2(
			$elm$bytes$Bytes$Decode$decode,
			$techbelly$elm_zmachine$Library$BytesExtra$loopDecoder(count),
			raw));
};
var $techbelly$elm_zmachine$ZMachine$Memory$versionFromInt = function (n) {
	switch (n) {
		case 3:
			return $elm$core$Maybe$Just($techbelly$elm_zmachine$ZMachine$Memory$V3);
		case 5:
			return $elm$core$Maybe$Just($techbelly$elm_zmachine$ZMachine$Memory$V5);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $techbelly$elm_zmachine$ZMachine$Memory$fromBytes = function (raw) {
	var len = $elm$bytes$Bytes$width(raw);
	if (len < 64) {
		return $elm$core$Result$Err('Story file too small (minimum 64 bytes)');
	} else {
		var _v0 = $techbelly$elm_zmachine$ZMachine$Memory$decodeHeader(raw);
		if (_v0.$ === 'Nothing') {
			return $elm$core$Result$Err('Failed to decode story file header');
		} else {
			var _v1 = _v0.a;
			var versionByte = _v1.a;
			var staticBase = _v1.b;
			var _v2 = $techbelly$elm_zmachine$ZMachine$Memory$versionFromInt(versionByte);
			if (_v2.$ === 'Nothing') {
				return $elm$core$Result$Err(
					'Unsupported Z-Machine version: ' + ($elm$core$String$fromInt(versionByte) + ' (only versions 3 and 5 are supported)'));
			} else {
				var ver = _v2.a;
				return (staticBase < 64) ? $elm$core$Result$Err(
					'Invalid static memory base: ' + ($elm$core$String$fromInt(staticBase) + ' (must be >= 64)')) : ((_Utils_cmp(staticBase, len) > 0) ? $elm$core$Result$Err(
					'Static memory base ' + ($elm$core$String$fromInt(staticBase) + (' exceeds file length ' + $elm$core$String$fromInt(len)))) : $elm$core$Result$Ok(
					$techbelly$elm_zmachine$ZMachine$Memory$Memory(
						{
							bytes: $techbelly$elm_zmachine$Library$BytesExtra$toIntArray(raw),
							fileLength: len,
							staticBase: staticBase,
							versionProfile: $techbelly$elm_zmachine$ZMachine$Memory$makeProfile(ver)
						})));
			}
		}
	}
};
var $techbelly$elm_zmachine$ZMachine$Types$Lower = {$: 'Lower'};
var $elm$core$Dict$RBEmpty_elm_builtin = {$: 'RBEmpty_elm_builtin'};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $techbelly$elm_zmachine$ZMachine$Player$empty = {globalCandidates: $elm$core$Dict$empty, playerObject: 0};
var $techbelly$elm_zmachine$ZMachine$Window$empty = function (width) {
	return {cursorCol: 1, cursorRow: 1, firstPrintedObj: 0, height: 0, rows: $elm$core$Dict$empty, width: width};
};
var $elm$core$Bitwise$or = _Bitwise_or;
var $elm$core$Array$getHelp = F3(
	function (shift, index, tree) {
		getHelp:
		while (true) {
			var pos = $elm$core$Array$bitMask & (index >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var subTree = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$index = index,
					$temp$tree = subTree;
				shift = $temp$shift;
				index = $temp$index;
				tree = $temp$tree;
				continue getHelp;
			} else {
				var values = _v0.a;
				return A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, values);
			}
		}
	});
var $elm$core$Array$tailIndex = function (len) {
	return (len >>> 5) << 5;
};
var $elm$core$Array$get = F2(
	function (index, _v0) {
		var len = _v0.a;
		var startShift = _v0.b;
		var tree = _v0.c;
		var tail = _v0.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? $elm$core$Maybe$Nothing : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? $elm$core$Maybe$Just(
			A2($elm$core$Elm$JsArray$unsafeGet, $elm$core$Array$bitMask & index, tail)) : $elm$core$Maybe$Just(
			A3($elm$core$Array$getHelp, startShift, index, tree)));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$readByte = F2(
	function (addr, _v0) {
		var mem = _v0.a;
		return (addr < 0) ? 0 : A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, addr, mem.bytes));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$readWord = F2(
	function (addr, mem) {
		var lo = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr + 1, mem);
		var hi = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem);
		return (hi << 8) | lo;
	});
var $techbelly$elm_zmachine$ZMachine$Header$initialPC = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 6, mem);
};
var $techbelly$elm_zmachine$ZMachine$Memory$profile = function (_v0) {
	var mem = _v0.a;
	return mem.versionProfile;
};
var $elm$core$Array$setHelp = F4(
	function (shift, index, value, tree) {
		var pos = $elm$core$Array$bitMask & (index >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
		if (_v0.$ === 'SubTree') {
			var subTree = _v0.a;
			var newSub = A4($elm$core$Array$setHelp, shift - $elm$core$Array$shiftStep, index, value, subTree);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$SubTree(newSub),
				tree);
		} else {
			var values = _v0.a;
			var newLeaf = A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, values);
			return A3(
				$elm$core$Elm$JsArray$unsafeSet,
				pos,
				$elm$core$Array$Leaf(newLeaf),
				tree);
		}
	});
var $elm$core$Array$set = F3(
	function (index, value, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		return ((index < 0) || (_Utils_cmp(index, len) > -1)) ? array : ((_Utils_cmp(
			index,
			$elm$core$Array$tailIndex(len)) > -1) ? A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			tree,
			A3($elm$core$Elm$JsArray$unsafeSet, $elm$core$Array$bitMask & index, value, tail)) : A4(
			$elm$core$Array$Array_elm_builtin,
			len,
			startShift,
			A4($elm$core$Array$setHelp, startShift, index, value, tree),
			tail));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$writeByte = F3(
	function (addr, value, _v0) {
		var mem = _v0.a;
		return ((addr < 0) || (_Utils_cmp(addr, mem.staticBase) > -1)) ? $techbelly$elm_zmachine$ZMachine$Memory$Memory(mem) : $techbelly$elm_zmachine$ZMachine$Memory$Memory(
			_Utils_update(
				mem,
				{
					bytes: A3($elm$core$Array$set, addr, value & 255, mem.bytes)
				}));
	});
var $techbelly$elm_zmachine$ZMachine$Header$setDefaultColours = F3(
	function (background, foreground, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			45,
			foreground,
			A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, 44, background, mem));
	});
var $techbelly$elm_zmachine$ZMachine$Header$setInterpreterInfo = F3(
	function (number, versionChar, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			31,
			versionChar,
			A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, 30, number, mem));
	});
var $techbelly$elm_zmachine$ZMachine$Header$setScreenSize = F3(
	function (height, width, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			33,
			width,
			A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, 32, height, mem));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$writeWord = F3(
	function (addr, value, mem) {
		var lo = value & 255;
		var hi = (value >>> 8) & 255;
		return A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			addr + 1,
			lo,
			A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, addr, hi, mem));
	});
var $techbelly$elm_zmachine$ZMachine$Header$setScreenSizeUnits = F2(
	function (dims, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			39,
			dims.fontHeight,
			A3(
				$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
				38,
				dims.fontWidth,
				A3(
					$techbelly$elm_zmachine$ZMachine$Memory$writeWord,
					36,
					dims.heightUnits,
					A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, 34, dims.widthUnits, mem))));
	});
var $techbelly$elm_zmachine$ZMachine$Header$setStandardRevision = F3(
	function (major, minor, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			51,
			minor,
			A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, 50, major, mem));
	});
var $techbelly$elm_zmachine$ZMachine$State$init = function (mem) {
	var pc = $techbelly$elm_zmachine$ZMachine$Header$initialPC(mem);
	var baseMem = A3(
		$techbelly$elm_zmachine$ZMachine$Header$setStandardRevision,
		1,
		1,
		A3(
			$techbelly$elm_zmachine$ZMachine$Header$setScreenSize,
			25,
			80,
			A3(
				$techbelly$elm_zmachine$ZMachine$Header$setInterpreterInfo,
				3,
				$elm$core$Char$toCode(
					_Utils_chr('A')),
				mem)));
	var configuredMem = function () {
		var _v0 = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem).version;
		if (_v0.$ === 'V5') {
			return A3(
				$techbelly$elm_zmachine$ZMachine$Header$setDefaultColours,
				9,
				2,
				A2(
					$techbelly$elm_zmachine$ZMachine$Header$setScreenSizeUnits,
					{fontHeight: 1, fontWidth: 1, heightUnits: 25, widthUnits: 80},
					baseMem));
		} else {
			return baseMem;
		}
	}();
	return {
		callStack: _List_Nil,
		currentWindow: $techbelly$elm_zmachine$ZMachine$Types$Lower,
		memory: configuredMem,
		originalMemory: mem,
		output: _List_Nil,
		outputStreams: {stream1: true, stream2: false},
		pc: pc,
		playerTracking: $techbelly$elm_zmachine$ZMachine$Player$empty,
		randomState: {count: 0, seed: 12345},
		stack: _List_Nil,
		stream3Stack: _List_Nil,
		upperWindow: $techbelly$elm_zmachine$ZMachine$Window$empty(80)
	};
};
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (ra.$ === 'Ok') {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $techbelly$elm_zmachine$ZMachine$load = function (bytes) {
	return A2(
		$elm$core$Result$map,
		$techbelly$elm_zmachine$ZMachine$State$init,
		$techbelly$elm_zmachine$ZMachine$Memory$fromBytes(bytes));
};
var $techbelly$elm_zengine$ZEngine$LoadError = function (a) {
	return {$: 'LoadError', a: a};
};
var $techbelly$elm_zengine$ZEngine$loadFailed = function (message) {
	return {
		cmd: $elm$core$Platform$Cmd$none,
		error: $elm$core$Maybe$Just(
			$techbelly$elm_zengine$ZEngine$LoadError(message)),
		events: _List_Nil,
		session: $elm$core$Maybe$Nothing
	};
};
var $elm$core$Platform$Cmd$map = _Platform_map;
var $techbelly$elm_zengine$ZEngine$mapStep = F2(
	function (tagger, step) {
		return {
			cmd: A2($elm$core$Platform$Cmd$map, tagger, step.cmd),
			error: step.error,
			events: step.events,
			session: step.session
		};
	});
var $techbelly$elm_zengine$ZEngine$okStep = F3(
	function (session, events, cmd) {
		return {
			cmd: cmd,
			error: $elm$core$Maybe$Nothing,
			events: events,
			session: $elm$core$Maybe$Just(session)
		};
	});
var $techbelly$elm_zengine$ZEngine$Yielded = {$: 'Yielded'};
var $elm$core$Process$sleep = _Process_sleep;
var $techbelly$elm_zengine$ZEngine$yieldCmd = A2(
	$elm$core$Task$perform,
	function (_v0) {
		return $techbelly$elm_zengine$ZEngine$Yielded;
	},
	$elm$core$Process$sleep(0));
var $techbelly$elm_zengine$ZEngine$new = F3(
	function (tagger, config, bytes) {
		return A2(
			$techbelly$elm_zengine$ZEngine$mapStep,
			tagger,
			function () {
				var _v0 = $techbelly$elm_zmachine$ZMachine$load(bytes);
				if (_v0.$ === 'Err') {
					var err = _v0.a;
					return $techbelly$elm_zengine$ZEngine$loadFailed(err);
				} else {
					var machine = _v0.a;
					return A3(
						$techbelly$elm_zengine$ZEngine$okStep,
						$techbelly$elm_zengine$ZEngine$Session(
							A3($techbelly$elm_zengine$ZEngine$initialState, config, machine, bytes)),
						_List_Nil,
						$techbelly$elm_zengine$ZEngine$yieldCmd);
				}
			}());
	});
var $techbelly$elm_zengine$ZEngine$Types$InputFrame = function (a) {
	return {$: 'InputFrame', a: a};
};
var $techbelly$elm_zengine$ZEngine$Internal$Running = {$: 'Running'};
var $techbelly$elm_zengine$ZEngine$StepCompleted = function (a) {
	return {$: 'StepCompleted', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Types$Continue = F2(
	function (a, b) {
		return {$: 'Continue', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$Op2 = function (a) {
	return {$: 'Op2', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$branches = F2(
	function (version, opcode) {
		_v0$17:
		while (true) {
			switch (opcode.$) {
				case 'Op2':
					switch (opcode.a.$) {
						case 'Je':
							var _v1 = opcode.a;
							return true;
						case 'Jl':
							var _v2 = opcode.a;
							return true;
						case 'Jg':
							var _v3 = opcode.a;
							return true;
						case 'DecChk':
							var _v4 = opcode.a;
							return true;
						case 'IncChk':
							var _v5 = opcode.a;
							return true;
						case 'Jin':
							var _v6 = opcode.a;
							return true;
						case 'Test':
							var _v7 = opcode.a;
							return true;
						case 'TestAttr':
							var _v8 = opcode.a;
							return true;
						default:
							break _v0$17;
					}
				case 'Op1':
					switch (opcode.a.$) {
						case 'Jz':
							var _v9 = opcode.a;
							return true;
						case 'GetSibling':
							var _v10 = opcode.a;
							return true;
						case 'GetChild':
							var _v11 = opcode.a;
							return true;
						default:
							break _v0$17;
					}
				case 'Op0':
					switch (opcode.a.$) {
						case 'Save':
							var _v12 = opcode.a;
							if (version.$ === 'V3') {
								return true;
							} else {
								return false;
							}
						case 'Restore':
							var _v14 = opcode.a;
							if (version.$ === 'V3') {
								return true;
							} else {
								return false;
							}
						case 'Verify':
							var _v16 = opcode.a;
							return true;
						case 'Piracy':
							var _v17 = opcode.a;
							return true;
						default:
							break _v0$17;
					}
				case 'OpVar':
					switch (opcode.a.$) {
						case 'ScanTable':
							var _v18 = opcode.a;
							return true;
						case 'CheckArgCount':
							var _v19 = opcode.a;
							return true;
						default:
							break _v0$17;
					}
				default:
					break _v0$17;
			}
		}
		return false;
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$Offset = function (a) {
	return {$: 'Offset', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$ReturnFalse = {$: 'ReturnFalse'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ReturnTrue = {$: 'ReturnTrue'};
var $techbelly$elm_zmachine$ZMachine$Decode$branchTargetFromOffset = function (offset) {
	switch (offset) {
		case 0:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ReturnFalse;
		case 1:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ReturnTrue;
		default:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Offset(offset);
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $techbelly$elm_zmachine$ZMachine$Memory$wordLength = 2;
var $techbelly$elm_zmachine$ZMachine$Decode$decodeBranch = F2(
	function (pos, mem) {
		var firstByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pos, mem);
		var singleByte = !(!(firstByte & 64));
		var condition = !(!(firstByte & 128));
		if (singleByte) {
			var offset = firstByte & 63;
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					{
						condition: condition,
						target: $techbelly$elm_zmachine$ZMachine$Decode$branchTargetFromOffset(offset)
					}),
				pos + 1);
		} else {
			var lowByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pos + 1, mem);
			var highBits = firstByte & 63;
			var raw14 = (highBits << 8) | lowByte;
			var offset = (raw14 > 8191) ? (raw14 - 16384) : raw14;
			return _Utils_Tuple2(
				$elm$core$Maybe$Just(
					{
						condition: condition,
						target: $techbelly$elm_zmachine$ZMachine$Decode$branchTargetFromOffset(offset)
					}),
				pos + $techbelly$elm_zmachine$ZMachine$Memory$wordLength);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Text$readZWords = F3(
	function (addr, mem, acc) {
		readZWords:
		while (true) {
			var word = A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, addr, mem);
			var nextAddr = addr + $techbelly$elm_zmachine$ZMachine$Memory$wordLength;
			var newAcc = A2($elm$core$List$cons, word, acc);
			var isEnd = !(!(word & 32768));
			if (isEnd) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(newAcc),
					nextAddr);
			} else {
				var $temp$addr = nextAddr,
					$temp$mem = mem,
					$temp$acc = newAcc;
				addr = $temp$addr;
				mem = $temp$mem;
				acc = $temp$acc;
				continue readZWords;
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Decode$decodeInlineText = F2(
	function (pos, mem) {
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$Text$readZWords, pos, mem, _List_Nil);
		var words = _v0.a;
		var endPos = _v0.b;
		return _Utils_Tuple2(
			$elm$core$Maybe$Just(words),
			endPos);
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$hasText = function (opcode) {
	_v0$2:
	while (true) {
		if (opcode.$ === 'Op0') {
			switch (opcode.a.$) {
				case 'Print':
					var _v1 = opcode.a;
					return true;
				case 'PrintRet':
					var _v2 = opcode.a;
					return true;
				default:
					break _v0$2;
			}
		} else {
			break _v0$2;
		}
	}
	return false;
};
var $techbelly$elm_zmachine$ZMachine$Opcode$storesResult = F2(
	function (version, opcode) {
		_v0$37:
		while (true) {
			switch (opcode.$) {
				case 'Op2':
					switch (opcode.a.$) {
						case 'Or':
							var _v1 = opcode.a;
							return true;
						case 'And':
							var _v2 = opcode.a;
							return true;
						case 'Loadw':
							var _v3 = opcode.a;
							return true;
						case 'Loadb':
							var _v4 = opcode.a;
							return true;
						case 'GetProp':
							var _v5 = opcode.a;
							return true;
						case 'GetPropAddr':
							var _v6 = opcode.a;
							return true;
						case 'GetNextProp':
							var _v7 = opcode.a;
							return true;
						case 'Add':
							var _v8 = opcode.a;
							return true;
						case 'Sub':
							var _v9 = opcode.a;
							return true;
						case 'Mul':
							var _v10 = opcode.a;
							return true;
						case 'Div':
							var _v11 = opcode.a;
							return true;
						case 'Mod':
							var _v12 = opcode.a;
							return true;
						case 'CallS2':
							var _v13 = opcode.a;
							return true;
						default:
							break _v0$37;
					}
				case 'Op1':
					switch (opcode.a.$) {
						case 'GetSibling':
							var _v14 = opcode.a;
							return true;
						case 'GetChild':
							var _v15 = opcode.a;
							return true;
						case 'GetParent':
							var _v16 = opcode.a;
							return true;
						case 'GetPropLen':
							var _v17 = opcode.a;
							return true;
						case 'Load':
							var _v18 = opcode.a;
							return true;
						case 'Not':
							var _v19 = opcode.a;
							return true;
						case 'CallS1':
							var _v20 = opcode.a;
							return true;
						default:
							break _v0$37;
					}
				case 'OpVar':
					switch (opcode.a.$) {
						case 'Call':
							var _v21 = opcode.a;
							return true;
						case 'CallVs2':
							var _v22 = opcode.a;
							return true;
						case 'Random':
							var _v23 = opcode.a;
							return true;
						case 'ReadChar':
							var _v24 = opcode.a;
							return true;
						case 'ScanTable':
							var _v25 = opcode.a;
							return true;
						case 'NotV5':
							var _v26 = opcode.a;
							return true;
						case 'Sread':
							var _v27 = opcode.a;
							if (version.$ === 'V5') {
								return true;
							} else {
								return false;
							}
						default:
							break _v0$37;
					}
				case 'Op0':
					switch (opcode.a.$) {
						case 'Save':
							var _v29 = opcode.a;
							if (version.$ === 'V5') {
								return true;
							} else {
								return false;
							}
						case 'Restore':
							var _v31 = opcode.a;
							if (version.$ === 'V5') {
								return true;
							} else {
								return false;
							}
						case 'Pop':
							var _v33 = opcode.a;
							if (version.$ === 'V5') {
								return true;
							} else {
								return false;
							}
						default:
							break _v0$37;
					}
				default:
					switch (opcode.a.$) {
						case 'ExtSave':
							var _v35 = opcode.a;
							return true;
						case 'ExtRestore':
							var _v36 = opcode.a;
							return true;
						case 'LogShift':
							var _v37 = opcode.a;
							return true;
						case 'ArtShift':
							var _v38 = opcode.a;
							return true;
						case 'SetFont':
							var _v39 = opcode.a;
							return true;
						case 'SaveUndo':
							var _v40 = opcode.a;
							return true;
						case 'RestoreUndo':
							var _v41 = opcode.a;
							return true;
						default:
							break _v0$37;
					}
			}
		}
		return false;
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$Global = function (a) {
	return {$: 'Global', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$Local = function (a) {
	return {$: 'Local', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$Stack = {$: 'Stack'};
var $techbelly$elm_zmachine$ZMachine$Opcode$variableRefFromByte = function (_byte) {
	return (!_byte) ? $techbelly$elm_zmachine$ZMachine$Opcode$Stack : ((_byte <= 15) ? $techbelly$elm_zmachine$ZMachine$Opcode$Local(_byte) : $techbelly$elm_zmachine$ZMachine$Opcode$Global(_byte));
};
var $techbelly$elm_zmachine$ZMachine$Decode$decodePostOperands = F5(
	function (pc, pos, opcode, operands, mem) {
		var version = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem).version;
		var _v0 = A2($techbelly$elm_zmachine$ZMachine$Opcode$storesResult, version, opcode) ? _Utils_Tuple2(
			$elm$core$Maybe$Just(
				$techbelly$elm_zmachine$ZMachine$Opcode$variableRefFromByte(
					A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pos, mem))),
			pos + 1) : _Utils_Tuple2($elm$core$Maybe$Nothing, pos);
		var store = _v0.a;
		var posAfterStore = _v0.b;
		var _v1 = A2($techbelly$elm_zmachine$ZMachine$Opcode$branches, version, opcode) ? A2($techbelly$elm_zmachine$ZMachine$Decode$decodeBranch, posAfterStore, mem) : _Utils_Tuple2($elm$core$Maybe$Nothing, posAfterStore);
		var branch = _v1.a;
		var posAfterBranch = _v1.b;
		var _v2 = $techbelly$elm_zmachine$ZMachine$Opcode$hasText(opcode) ? A2($techbelly$elm_zmachine$ZMachine$Decode$decodeInlineText, posAfterBranch, mem) : _Utils_Tuple2($elm$core$Maybe$Nothing, posAfterBranch);
		var text = _v2.a;
		var posAfterText = _v2.b;
		return {branch: branch, length: posAfterText - pc, opcode: opcode, operands: operands, store: store, textLiteral: text};
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$Add = {$: 'Add'};
var $techbelly$elm_zmachine$ZMachine$Opcode$And = {$: 'And'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallN2 = {$: 'CallN2'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallS2 = {$: 'CallS2'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ClearAttr = {$: 'ClearAttr'};
var $techbelly$elm_zmachine$ZMachine$Opcode$DecChk = {$: 'DecChk'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Div = {$: 'Div'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetNextProp = {$: 'GetNextProp'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetProp = {$: 'GetProp'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetPropAddr = {$: 'GetPropAddr'};
var $techbelly$elm_zmachine$ZMachine$Opcode$IncChk = {$: 'IncChk'};
var $techbelly$elm_zmachine$ZMachine$Opcode$InsertObj = {$: 'InsertObj'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Je = {$: 'Je'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Jg = {$: 'Jg'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Jin = {$: 'Jin'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Jl = {$: 'Jl'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Loadb = {$: 'Loadb'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Loadw = {$: 'Loadw'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Mod = {$: 'Mod'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Mul = {$: 'Mul'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Or = {$: 'Or'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SetAttr = {$: 'SetAttr'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SetColour = {$: 'SetColour'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Store = {$: 'Store'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Sub = {$: 'Sub'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Test = {$: 'Test'};
var $techbelly$elm_zmachine$ZMachine$Opcode$TestAttr = {$: 'TestAttr'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Throw = {$: 'Throw'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Unknown2Op = function (a) {
	return {$: 'Unknown2Op', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$op2FromNumber = function (n) {
	switch (n) {
		case 1:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Je;
		case 2:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Jl;
		case 3:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Jg;
		case 4:
			return $techbelly$elm_zmachine$ZMachine$Opcode$DecChk;
		case 5:
			return $techbelly$elm_zmachine$ZMachine$Opcode$IncChk;
		case 6:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Jin;
		case 7:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Test;
		case 8:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Or;
		case 9:
			return $techbelly$elm_zmachine$ZMachine$Opcode$And;
		case 10:
			return $techbelly$elm_zmachine$ZMachine$Opcode$TestAttr;
		case 11:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SetAttr;
		case 12:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ClearAttr;
		case 13:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Store;
		case 14:
			return $techbelly$elm_zmachine$ZMachine$Opcode$InsertObj;
		case 15:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Loadw;
		case 16:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Loadb;
		case 17:
			return $techbelly$elm_zmachine$ZMachine$Opcode$GetProp;
		case 18:
			return $techbelly$elm_zmachine$ZMachine$Opcode$GetPropAddr;
		case 19:
			return $techbelly$elm_zmachine$ZMachine$Opcode$GetNextProp;
		case 20:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Add;
		case 21:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Sub;
		case 22:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Mul;
		case 23:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Div;
		case 24:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Mod;
		case 25:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CallS2;
		case 26:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CallN2;
		case 27:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SetColour;
		case 28:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Throw;
		default:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Unknown2Op(n);
	}
};
var $techbelly$elm_zmachine$ZMachine$Opcode$LargeConstant = function (a) {
	return {$: 'LargeConstant', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$SmallConstant = function (a) {
	return {$: 'SmallConstant', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$Variable = function (a) {
	return {$: 'Variable', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Decode$readOperandByType = F3(
	function (opType, pos, mem) {
		switch (opType) {
			case 0:
				return _Utils_Tuple2(
					$techbelly$elm_zmachine$ZMachine$Opcode$LargeConstant(
						A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, pos, mem)),
					pos + $techbelly$elm_zmachine$ZMachine$Memory$wordLength);
			case 1:
				return _Utils_Tuple2(
					$techbelly$elm_zmachine$ZMachine$Opcode$SmallConstant(
						A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pos, mem)),
					pos + 1);
			case 2:
				return _Utils_Tuple2(
					$techbelly$elm_zmachine$ZMachine$Opcode$Variable(
						$techbelly$elm_zmachine$ZMachine$Opcode$variableRefFromByte(
							A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pos, mem))),
					pos + 1);
			default:
				return _Utils_Tuple2(
					$techbelly$elm_zmachine$ZMachine$Opcode$SmallConstant(0),
					pos);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Decode$decodeLong = F3(
	function (pc, opcodeByte, mem) {
		var type2 = (!(!(opcodeByte & 32))) ? 2 : 1;
		var type1 = (!(!(opcodeByte & 64))) ? 2 : 1;
		var pos1 = pc + 1;
		var opcodeNum = opcodeByte & 31;
		var opcode = $techbelly$elm_zmachine$ZMachine$Opcode$Op2(
			$techbelly$elm_zmachine$ZMachine$Opcode$op2FromNumber(opcodeNum));
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandByType, type1, pos1, mem);
		var op1 = _v0.a;
		var pos2 = _v0.b;
		var _v1 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandByType, type2, pos2, mem);
		var op2 = _v1.a;
		var pos3 = _v1.b;
		return A5(
			$techbelly$elm_zmachine$ZMachine$Decode$decodePostOperands,
			pc,
			pos3,
			opcode,
			_List_fromArray(
				[op1, op2]),
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$Op0 = function (a) {
	return {$: 'Op0', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$Op1 = function (a) {
	return {$: 'Op1', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$OpExt = function (a) {
	return {$: 'OpExt', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$ArtShift = {$: 'ArtShift'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ExtRestore = {$: 'ExtRestore'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ExtSave = {$: 'ExtSave'};
var $techbelly$elm_zmachine$ZMachine$Opcode$LogShift = {$: 'LogShift'};
var $techbelly$elm_zmachine$ZMachine$Opcode$RestoreUndo = {$: 'RestoreUndo'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SaveUndo = {$: 'SaveUndo'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SetFont = {$: 'SetFont'};
var $techbelly$elm_zmachine$ZMachine$Opcode$UnknownExt = function (a) {
	return {$: 'UnknownExt', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$opExtFromNumber = function (n) {
	switch (n) {
		case 0:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ExtSave;
		case 1:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ExtRestore;
		case 2:
			return $techbelly$elm_zmachine$ZMachine$Opcode$LogShift;
		case 3:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ArtShift;
		case 4:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SetFont;
		case 9:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SaveUndo;
		case 10:
			return $techbelly$elm_zmachine$ZMachine$Opcode$RestoreUndo;
		default:
			return $techbelly$elm_zmachine$ZMachine$Opcode$UnknownExt(n);
	}
};
var $techbelly$elm_zmachine$ZMachine$Decode$readOperandsList = F4(
	function (types, pos, mem, acc) {
		readOperandsList:
		while (true) {
			if (!types.b) {
				return _Utils_Tuple2(
					$elm$core$List$reverse(acc),
					pos);
			} else {
				var t = types.a;
				var rest = types.b;
				if (t === 3) {
					return _Utils_Tuple2(
						$elm$core$List$reverse(acc),
						pos);
				} else {
					var _v1 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandByType, t, pos, mem);
					var operand = _v1.a;
					var nextPos = _v1.b;
					var $temp$types = rest,
						$temp$pos = nextPos,
						$temp$mem = mem,
						$temp$acc = A2($elm$core$List$cons, operand, acc);
					types = $temp$types;
					pos = $temp$pos;
					mem = $temp$mem;
					acc = $temp$acc;
					continue readOperandsList;
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Decode$readOperandsFromTypes = F3(
	function (typesByte, startPos, mem) {
		var types = _List_fromArray(
			[(typesByte >>> 6) & 3, (typesByte >>> 4) & 3, (typesByte >>> 2) & 3, typesByte & 3]);
		return A4($techbelly$elm_zmachine$ZMachine$Decode$readOperandsList, types, startPos, mem, _List_Nil);
	});
var $techbelly$elm_zmachine$ZMachine$Decode$decodeExtended = F2(
	function (pc, mem) {
		var typesByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pc + 2, mem);
		var extOpcodeNum = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pc + 1, mem);
		var opcode = $techbelly$elm_zmachine$ZMachine$Opcode$OpExt(
			$techbelly$elm_zmachine$ZMachine$Opcode$opExtFromNumber(extOpcodeNum));
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandsFromTypes, typesByte, pc + 3, mem);
		var operands = _v0.a;
		var nextPos = _v0.b;
		return A5($techbelly$elm_zmachine$ZMachine$Decode$decodePostOperands, pc, nextPos, opcode, operands, mem);
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$NewLine = {$: 'NewLine'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Nop = {$: 'Nop'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Piracy = {$: 'Piracy'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Pop = {$: 'Pop'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Print = {$: 'Print'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintRet = {$: 'PrintRet'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Quit = {$: 'Quit'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Restart = {$: 'Restart'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Restore = {$: 'Restore'};
var $techbelly$elm_zmachine$ZMachine$Opcode$RetPopped = {$: 'RetPopped'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Rfalse = {$: 'Rfalse'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Rtrue = {$: 'Rtrue'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Save = {$: 'Save'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ShowStatus = {$: 'ShowStatus'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Unknown0Op = function (a) {
	return {$: 'Unknown0Op', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$Verify = {$: 'Verify'};
var $techbelly$elm_zmachine$ZMachine$Opcode$op0FromNumber = function (n) {
	switch (n) {
		case 0:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Rtrue;
		case 1:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Rfalse;
		case 2:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Print;
		case 3:
			return $techbelly$elm_zmachine$ZMachine$Opcode$PrintRet;
		case 4:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Nop;
		case 5:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Save;
		case 6:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Restore;
		case 7:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Restart;
		case 8:
			return $techbelly$elm_zmachine$ZMachine$Opcode$RetPopped;
		case 9:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Pop;
		case 10:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Quit;
		case 11:
			return $techbelly$elm_zmachine$ZMachine$Opcode$NewLine;
		case 12:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ShowStatus;
		case 13:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Verify;
		case 15:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Piracy;
		default:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Unknown0Op(n);
	}
};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallN1 = {$: 'CallN1'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallS1 = {$: 'CallS1'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Dec = {$: 'Dec'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetChild = {$: 'GetChild'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetParent = {$: 'GetParent'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetPropLen = {$: 'GetPropLen'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetSibling = {$: 'GetSibling'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Inc = {$: 'Inc'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Jump = {$: 'Jump'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Jz = {$: 'Jz'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Load = {$: 'Load'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Not = {$: 'Not'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintAddr = {$: 'PrintAddr'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintObj = {$: 'PrintObj'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintPaddr = {$: 'PrintPaddr'};
var $techbelly$elm_zmachine$ZMachine$Opcode$RemoveObj = {$: 'RemoveObj'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Ret = {$: 'Ret'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Unknown1Op = function (a) {
	return {$: 'Unknown1Op', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$op1FromNumber = F2(
	function (version, n) {
		switch (n) {
			case 0:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Jz;
			case 1:
				return $techbelly$elm_zmachine$ZMachine$Opcode$GetSibling;
			case 2:
				return $techbelly$elm_zmachine$ZMachine$Opcode$GetChild;
			case 3:
				return $techbelly$elm_zmachine$ZMachine$Opcode$GetParent;
			case 4:
				return $techbelly$elm_zmachine$ZMachine$Opcode$GetPropLen;
			case 5:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Inc;
			case 6:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Dec;
			case 7:
				return $techbelly$elm_zmachine$ZMachine$Opcode$PrintAddr;
			case 8:
				return $techbelly$elm_zmachine$ZMachine$Opcode$CallS1;
			case 9:
				return $techbelly$elm_zmachine$ZMachine$Opcode$RemoveObj;
			case 10:
				return $techbelly$elm_zmachine$ZMachine$Opcode$PrintObj;
			case 11:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Ret;
			case 12:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Jump;
			case 13:
				return $techbelly$elm_zmachine$ZMachine$Opcode$PrintPaddr;
			case 14:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Load;
			case 15:
				if (version.$ === 'V3') {
					return $techbelly$elm_zmachine$ZMachine$Opcode$Not;
				} else {
					return $techbelly$elm_zmachine$ZMachine$Opcode$CallN1;
				}
			default:
				return $techbelly$elm_zmachine$ZMachine$Opcode$Unknown1Op(n);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Decode$decodeShort = F3(
	function (pc, opcodeByte, mem) {
		var pos = pc + 1;
		var opcodeNum = opcodeByte & 15;
		var opType = (opcodeByte >>> 4) & 3;
		if ((opType === 3) && ((opcodeNum === 14) && _Utils_eq(
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).version,
			$techbelly$elm_zmachine$ZMachine$Memory$V5))) {
			return A2($techbelly$elm_zmachine$ZMachine$Decode$decodeExtended, pc, mem);
		} else {
			if (opType === 3) {
				var opcode = $techbelly$elm_zmachine$ZMachine$Opcode$Op0(
					$techbelly$elm_zmachine$ZMachine$Opcode$op0FromNumber(opcodeNum));
				return A5($techbelly$elm_zmachine$ZMachine$Decode$decodePostOperands, pc, pos, opcode, _List_Nil, mem);
			} else {
				var opcode = $techbelly$elm_zmachine$ZMachine$Opcode$Op1(
					A2(
						$techbelly$elm_zmachine$ZMachine$Opcode$op1FromNumber,
						$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).version,
						opcodeNum));
				var _v0 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandByType, opType, pos, mem);
				var operand = _v0.a;
				var nextPos = _v0.b;
				return A5(
					$techbelly$elm_zmachine$ZMachine$Decode$decodePostOperands,
					pc,
					nextPos,
					opcode,
					_List_fromArray(
						[operand]),
					mem);
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Opcode$OpVar = function (a) {
	return {$: 'OpVar', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$BufferMode = {$: 'BufferMode'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Call = {$: 'Call'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallVn = {$: 'CallVn'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallVn2 = {$: 'CallVn2'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CallVs2 = {$: 'CallVs2'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CheckArgCount = {$: 'CheckArgCount'};
var $techbelly$elm_zmachine$ZMachine$Opcode$CopyTable = {$: 'CopyTable'};
var $techbelly$elm_zmachine$ZMachine$Opcode$EncodeText = {$: 'EncodeText'};
var $techbelly$elm_zmachine$ZMachine$Opcode$EraseLine = {$: 'EraseLine'};
var $techbelly$elm_zmachine$ZMachine$Opcode$EraseWindow = {$: 'EraseWindow'};
var $techbelly$elm_zmachine$ZMachine$Opcode$GetCursor = {$: 'GetCursor'};
var $techbelly$elm_zmachine$ZMachine$Opcode$InputStream = {$: 'InputStream'};
var $techbelly$elm_zmachine$ZMachine$Opcode$NotV5 = {$: 'NotV5'};
var $techbelly$elm_zmachine$ZMachine$Opcode$OutputStream = {$: 'OutputStream'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintChar = {$: 'PrintChar'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintNum = {$: 'PrintNum'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PrintTable = {$: 'PrintTable'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Pull = {$: 'Pull'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Push = {$: 'Push'};
var $techbelly$elm_zmachine$ZMachine$Opcode$PutProp = {$: 'PutProp'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Random = {$: 'Random'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ReadChar = {$: 'ReadChar'};
var $techbelly$elm_zmachine$ZMachine$Opcode$ScanTable = {$: 'ScanTable'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SetCursor = {$: 'SetCursor'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SetTextStyle = {$: 'SetTextStyle'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SetWindow = {$: 'SetWindow'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SoundEffect = {$: 'SoundEffect'};
var $techbelly$elm_zmachine$ZMachine$Opcode$SplitWindow = {$: 'SplitWindow'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Sread = {$: 'Sread'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Storeb = {$: 'Storeb'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Storew = {$: 'Storew'};
var $techbelly$elm_zmachine$ZMachine$Opcode$Tokenise = {$: 'Tokenise'};
var $techbelly$elm_zmachine$ZMachine$Opcode$UnknownVar = function (a) {
	return {$: 'UnknownVar', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Opcode$opVarFromNumber = function (n) {
	switch (n) {
		case 0:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Call;
		case 1:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Storew;
		case 2:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Storeb;
		case 3:
			return $techbelly$elm_zmachine$ZMachine$Opcode$PutProp;
		case 4:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Sread;
		case 5:
			return $techbelly$elm_zmachine$ZMachine$Opcode$PrintChar;
		case 6:
			return $techbelly$elm_zmachine$ZMachine$Opcode$PrintNum;
		case 7:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Random;
		case 8:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Push;
		case 9:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Pull;
		case 10:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SplitWindow;
		case 11:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SetWindow;
		case 12:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CallVs2;
		case 13:
			return $techbelly$elm_zmachine$ZMachine$Opcode$EraseWindow;
		case 14:
			return $techbelly$elm_zmachine$ZMachine$Opcode$EraseLine;
		case 15:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SetCursor;
		case 16:
			return $techbelly$elm_zmachine$ZMachine$Opcode$GetCursor;
		case 17:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SetTextStyle;
		case 18:
			return $techbelly$elm_zmachine$ZMachine$Opcode$BufferMode;
		case 19:
			return $techbelly$elm_zmachine$ZMachine$Opcode$OutputStream;
		case 20:
			return $techbelly$elm_zmachine$ZMachine$Opcode$InputStream;
		case 21:
			return $techbelly$elm_zmachine$ZMachine$Opcode$SoundEffect;
		case 22:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ReadChar;
		case 23:
			return $techbelly$elm_zmachine$ZMachine$Opcode$ScanTable;
		case 24:
			return $techbelly$elm_zmachine$ZMachine$Opcode$NotV5;
		case 25:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CallVn;
		case 26:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CallVn2;
		case 27:
			return $techbelly$elm_zmachine$ZMachine$Opcode$Tokenise;
		case 28:
			return $techbelly$elm_zmachine$ZMachine$Opcode$EncodeText;
		case 29:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CopyTable;
		case 30:
			return $techbelly$elm_zmachine$ZMachine$Opcode$PrintTable;
		case 31:
			return $techbelly$elm_zmachine$ZMachine$Opcode$CheckArgCount;
		default:
			return $techbelly$elm_zmachine$ZMachine$Opcode$UnknownVar(n);
	}
};
var $techbelly$elm_zmachine$ZMachine$Decode$decodeVariable = F3(
	function (pc, opcodeByte, mem) {
		var typesByte1 = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pc + 1, mem);
		var opcodeNum = opcodeByte & 31;
		var opcode = (!(opcodeByte & 32)) ? $techbelly$elm_zmachine$ZMachine$Opcode$Op2(
			$techbelly$elm_zmachine$ZMachine$Opcode$op2FromNumber(opcodeNum)) : $techbelly$elm_zmachine$ZMachine$Opcode$OpVar(
			$techbelly$elm_zmachine$ZMachine$Opcode$opVarFromNumber(opcodeNum));
		var hasDoubleTypes = (!(!(opcodeByte & 32))) && ((opcodeNum === 12) || (opcodeNum === 26));
		var _v0 = function () {
			if (hasDoubleTypes) {
				var typesByte2 = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pc + 2, mem);
				var _v1 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandsFromTypes, typesByte1, pc + 3, mem);
				var ops1 = _v1.a;
				var pos1 = _v1.b;
				var _v2 = A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandsFromTypes, typesByte2, pos1, mem);
				var ops2 = _v2.a;
				var pos2 = _v2.b;
				return _Utils_Tuple2(
					_Utils_ap(ops1, ops2),
					pos2);
			} else {
				return A3($techbelly$elm_zmachine$ZMachine$Decode$readOperandsFromTypes, typesByte1, pc + 2, mem);
			}
		}();
		var operands = _v0.a;
		var nextPos = _v0.b;
		return A5($techbelly$elm_zmachine$ZMachine$Decode$decodePostOperands, pc, nextPos, opcode, operands, mem);
	});
var $techbelly$elm_zmachine$ZMachine$Decode$decode = F2(
	function (pc, mem) {
		var opcodeByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, pc, mem);
		var topBits = opcodeByte >>> 6;
		switch (topBits) {
			case 3:
				return A3($techbelly$elm_zmachine$ZMachine$Decode$decodeVariable, pc, opcodeByte, mem);
			case 2:
				return A3($techbelly$elm_zmachine$ZMachine$Decode$decodeShort, pc, opcodeByte, mem);
			default:
				return A3($techbelly$elm_zmachine$ZMachine$Decode$decodeLong, pc, opcodeByte, mem);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Types$Error = F3(
	function (a, b, c) {
		return {$: 'Error', a: a, b: b, c: c};
	});
var $techbelly$elm_zmachine$ZMachine$Types$Halted = F2(
	function (a, b) {
		return {$: 'Halted', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Types$NeedChar = F2(
	function (a, b) {
		return {$: 'NeedChar', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Types$NeedInput = F3(
	function (a, b, c) {
		return {$: 'NeedInput', a: a, b: b, c: c};
	});
var $techbelly$elm_zmachine$ZMachine$Types$NeedRestore = F2(
	function (a, b) {
		return {$: 'NeedRestore', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Types$NeedSave = F3(
	function (a, b, c) {
		return {$: 'NeedSave', a: a, b: b, c: c};
	});
var $techbelly$elm_zmachine$ZMachine$Types$ScreenRows = function (a) {
	return {$: 'ScreenRows', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Types$ShowStatusLine = function (a) {
	return {$: 'ShowStatusLine', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Types$PrintText = function (a) {
	return {$: 'PrintText', a: a};
};
var $techbelly$elm_zmachine$ZMachine$State$appendOutput = F2(
	function (event, machine) {
		var _v0 = _Utils_Tuple2(event, machine.output);
		if (((_v0.a.$ === 'PrintText') && _v0.b.b) && (_v0.b.a.$ === 'PrintText')) {
			var _new = _v0.a.a;
			var _v1 = _v0.b;
			var prev = _v1.a.a;
			var rest = _v1.b;
			return _Utils_update(
				machine,
				{
					output: A2(
						$elm$core$List$cons,
						$techbelly$elm_zmachine$ZMachine$Types$PrintText(
							_Utils_ap(prev, _new)),
						rest)
				});
		} else {
			return _Utils_update(
				machine,
				{
					output: A2($elm$core$List$cons, event, machine.output)
				});
		}
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$List$sortBy = _List_sortBy;
var $techbelly$elm_zmachine$ZMachine$Player$bestCandidate = function (candidates) {
	return A2(
		$elm$core$Maybe$map,
		$elm$core$Tuple$first,
		$elm$core$List$head(
			A2(
				$elm$core$List$sortBy,
				function (_v0) {
					var count = _v0.b;
					return -count;
				},
				$elm$core$Dict$toList(candidates))));
};
var $techbelly$elm_zmachine$ZMachine$Player$firstGlobalVar = 16;
var $techbelly$elm_zmachine$ZMachine$Header$globalVariablesAddress = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 12, mem);
};
var $techbelly$elm_zmachine$ZMachine$Player$readGlobal = F2(
	function (varNum, mem) {
		return A2(
			$techbelly$elm_zmachine$ZMachine$Memory$readWord,
			$techbelly$elm_zmachine$ZMachine$Header$globalVariablesAddress(mem) + ((varNum - $techbelly$elm_zmachine$ZMachine$Player$firstGlobalVar) * $techbelly$elm_zmachine$ZMachine$Memory$wordLength),
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$Player$currentPlayer = F2(
	function (mem, tracking) {
		var _v0 = $techbelly$elm_zmachine$ZMachine$Player$bestCandidate(tracking.globalCandidates);
		if (_v0.$ === 'Just') {
			var globalN = _v0.a;
			return A2($techbelly$elm_zmachine$ZMachine$Player$readGlobal, globalN, mem);
		} else {
			return tracking.playerObject;
		}
	});
var $techbelly$elm_zmachine$ZMachine$Header$objectTableAddress = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 10, mem);
};
var $techbelly$elm_zmachine$ZMachine$ObjectTable$address = F2(
	function (objNum, mem) {
		var tableBase = $techbelly$elm_zmachine$ZMachine$Header$objectTableAddress(mem);
		var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem);
		var defaultsSize = p.numPropertyDefaults * $techbelly$elm_zmachine$ZMachine$Memory$wordLength;
		return (tableBase + defaultsSize) + ((objNum - 1) * p.objectEntrySize);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$readRelation = F3(
	function (offset, objNum, mem) {
		if (!objNum) {
			return 0;
		} else {
			var addr = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$address, objNum, mem) + offset;
			return ($techbelly$elm_zmachine$ZMachine$Memory$profile(mem).objectPointerSize === 1) ? A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem) : A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, addr, mem);
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$parent = F2(
	function (objNum, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$readRelation,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).parentOffset,
			objNum,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$Header$abbreviationsTableAddress = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 24, mem);
};
var $techbelly$elm_zmachine$ZMachine$Text$Abbreviation = function (a) {
	return {$: 'Abbreviation', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Text$None = {$: 'None'};
var $techbelly$elm_zmachine$ZMachine$Text$ZsciiHigh = {$: 'ZsciiHigh'};
var $techbelly$elm_zmachine$ZMachine$Text$ZsciiLow = function (a) {
	return {$: 'ZsciiLow', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Text$a1Shift = 4;
var $techbelly$elm_zmachine$ZMachine$Text$a2Shift = 5;
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $techbelly$elm_zmachine$ZMachine$Text$a0 = $elm$core$String$toList('abcdefghijklmnopqrstuvwxyz');
var $techbelly$elm_zmachine$ZMachine$Text$a1 = $elm$core$String$toList('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
var $techbelly$elm_zmachine$ZMachine$Text$a2 = $elm$core$String$toList('^^0123456789.,!?_#\'\"/\\-:()');
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $techbelly$elm_zmachine$Library$ListExtra$getAt = F2(
	function (index, list) {
		return $elm$core$List$head(
			A2($elm$core$List$drop, index, list));
	});
var $techbelly$elm_zmachine$ZMachine$Text$alphabetChar = F2(
	function (alphabet, zchar) {
		var index = zchar - 6;
		switch (alphabet) {
			case 0:
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_chr('?'),
					A2($techbelly$elm_zmachine$Library$ListExtra$getAt, index, $techbelly$elm_zmachine$ZMachine$Text$a0));
			case 1:
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_chr('?'),
					A2($techbelly$elm_zmachine$Library$ListExtra$getAt, index, $techbelly$elm_zmachine$ZMachine$Text$a1));
			case 2:
				return A2(
					$elm$core$Maybe$withDefault,
					_Utils_chr('?'),
					A2($techbelly$elm_zmachine$Library$ListExtra$getAt, index, $techbelly$elm_zmachine$ZMachine$Text$a2));
			default:
				return _Utils_chr('?');
		}
	});
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $techbelly$elm_zmachine$ZMachine$Text$zcharBits = 5;
var $techbelly$elm_zmachine$ZMachine$Text$zcharMask = 31;
var $techbelly$elm_zmachine$ZMachine$Text$extractZChars = function (word) {
	return _List_fromArray(
		[(word >>> (2 * $techbelly$elm_zmachine$ZMachine$Text$zcharBits)) & $techbelly$elm_zmachine$ZMachine$Text$zcharMask, (word >>> $techbelly$elm_zmachine$ZMachine$Text$zcharBits) & $techbelly$elm_zmachine$ZMachine$Text$zcharMask, word & $techbelly$elm_zmachine$ZMachine$Text$zcharMask]);
};
var $techbelly$elm_zmachine$ZMachine$Text$zsciiEscape = 6;
var $elm$core$Char$fromCode = _Char_fromCode;
var $techbelly$elm_zmachine$ZMachine$Text$zsciiToChar = function (code) {
	return (code === 13) ? _Utils_chr('\n') : (((code >= 32) && (code <= 126)) ? $elm$core$Char$fromCode(code) : _Utils_chr('?'));
};
var $techbelly$elm_zmachine$ZMachine$Text$decodeWords = F4(
	function (words, abbrTableAddr, mem, isAbbreviation) {
		var zchars = A2($elm$core$List$concatMap, $techbelly$elm_zmachine$ZMachine$Text$extractZChars, words);
		var initial = {alphabet: 0, output: _List_Nil, pending: $techbelly$elm_zmachine$ZMachine$Text$None};
		var _final = A3(
			$elm$core$List$foldl,
			A3($techbelly$elm_zmachine$ZMachine$Text$processZChar, abbrTableAddr, mem, isAbbreviation),
			initial,
			zchars);
		return $elm$core$List$reverse(_final.output);
	});
var $techbelly$elm_zmachine$ZMachine$Text$processZChar = F5(
	function (abbrTableAddr, mem, isAbbreviation, zchar, state) {
		var _v0 = state.pending;
		switch (_v0.$) {
			case 'Abbreviation':
				var abbrBase = _v0.a;
				var abbrChars = function () {
					if (isAbbreviation) {
						return _List_Nil;
					} else {
						var abbrIndex = abbrBase + zchar;
						var abbrWordAddr = abbrTableAddr + (abbrIndex * $techbelly$elm_zmachine$ZMachine$Memory$wordLength);
						var abbrStringAddr = A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, abbrWordAddr, mem) * $techbelly$elm_zmachine$ZMachine$Memory$wordLength;
						var _v1 = A3($techbelly$elm_zmachine$ZMachine$Text$readZWords, abbrStringAddr, mem, _List_Nil);
						var abbrWords = _v1.a;
						return A4($techbelly$elm_zmachine$ZMachine$Text$decodeWords, abbrWords, abbrTableAddr, mem, true);
					}
				}();
				return _Utils_update(
					state,
					{
						alphabet: 0,
						output: _Utils_ap(
							$elm$core$List$reverse(abbrChars),
							state.output),
						pending: $techbelly$elm_zmachine$ZMachine$Text$None
					});
			case 'ZsciiHigh':
				return _Utils_update(
					state,
					{
						pending: $techbelly$elm_zmachine$ZMachine$Text$ZsciiLow(zchar)
					});
			case 'ZsciiLow':
				var highBits = _v0.a;
				var zsciiCode = (highBits << $techbelly$elm_zmachine$ZMachine$Text$zcharBits) | zchar;
				var ch = $techbelly$elm_zmachine$ZMachine$Text$zsciiToChar(zsciiCode);
				return _Utils_update(
					state,
					{
						alphabet: 0,
						output: A2($elm$core$List$cons, ch, state.output),
						pending: $techbelly$elm_zmachine$ZMachine$Text$None
					});
			default:
				if (!zchar) {
					return _Utils_update(
						state,
						{
							alphabet: 0,
							output: A2(
								$elm$core$List$cons,
								_Utils_chr(' '),
								state.output)
						});
				} else {
					if ((zchar >= 1) && (zchar <= 3)) {
						return _Utils_update(
							state,
							{
								pending: $techbelly$elm_zmachine$ZMachine$Text$Abbreviation((zchar - 1) * 32)
							});
					} else {
						if (_Utils_eq(zchar, $techbelly$elm_zmachine$ZMachine$Text$a1Shift)) {
							return _Utils_update(
								state,
								{alphabet: 1});
						} else {
							if (_Utils_eq(zchar, $techbelly$elm_zmachine$ZMachine$Text$a2Shift)) {
								return _Utils_update(
									state,
									{alphabet: 2});
							} else {
								if ((state.alphabet === 2) && _Utils_eq(zchar, $techbelly$elm_zmachine$ZMachine$Text$zsciiEscape)) {
									return _Utils_update(
										state,
										{alphabet: 0, pending: $techbelly$elm_zmachine$ZMachine$Text$ZsciiHigh});
								} else {
									if ((state.alphabet === 2) && (zchar === 7)) {
										return _Utils_update(
											state,
											{
												alphabet: 0,
												output: A2(
													$elm$core$List$cons,
													_Utils_chr('\n'),
													state.output)
											});
									} else {
										var ch = A2($techbelly$elm_zmachine$ZMachine$Text$alphabetChar, state.alphabet, zchar);
										return _Utils_update(
											state,
											{
												alphabet: 0,
												output: A2($elm$core$List$cons, ch, state.output)
											});
									}
								}
							}
						}
					}
				}
		}
	});
var $elm$core$String$fromList = _String_fromList;
var $techbelly$elm_zmachine$ZMachine$Text$decodeZString = F2(
	function (addr, mem) {
		var abbrTableAddr = $techbelly$elm_zmachine$ZMachine$Header$abbreviationsTableAddress(mem);
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$Text$readZWords, addr, mem, _List_Nil);
		var words = _v0.a;
		var endAddr = _v0.b;
		var chars = A4($techbelly$elm_zmachine$ZMachine$Text$decodeWords, words, abbrTableAddr, mem, false);
		return _Utils_Tuple2(
			$elm$core$String$fromList(chars),
			endAddr - addr);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$propertyTableAddress = F2(
	function (objNum, mem) {
		return (!objNum) ? 0 : A2(
			$techbelly$elm_zmachine$ZMachine$Memory$readWord,
			A2($techbelly$elm_zmachine$ZMachine$ObjectTable$address, objNum, mem) + $techbelly$elm_zmachine$ZMachine$Memory$profile(mem).propPtrOffset,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$shortName = F2(
	function (objNum, mem) {
		if (!objNum) {
			return '';
		} else {
			var propTableAddr = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$propertyTableAddress, objNum, mem);
			var nameLen = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, propTableAddr, mem);
			return (!nameLen) ? '' : A2($techbelly$elm_zmachine$ZMachine$Text$decodeZString, propTableAddr + 1, mem).a;
		}
	});
var $techbelly$elm_zmachine$ZMachine$Player$currentLocation = F2(
	function (mem, tracking) {
		var player = A2($techbelly$elm_zmachine$ZMachine$Player$currentPlayer, mem, tracking);
		if (!player) {
			return _Utils_Tuple2(0, '');
		} else {
			var loc = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$parent, player, mem);
			return _Utils_Tuple2(
				loc,
				A2($techbelly$elm_zmachine$ZMachine$ObjectTable$shortName, loc, mem));
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $elm$core$List$maybeCons = F3(
	function (f, mx, xs) {
		var _v0 = f(mx);
		if (_v0.$ === 'Just') {
			var x = _v0.a;
			return A2($elm$core$List$cons, x, xs);
		} else {
			return xs;
		}
	});
var $elm$core$List$filterMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			$elm$core$List$maybeCons(f),
			_List_Nil,
			xs);
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === 'RBEmpty_elm_builtin') {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1.$) {
					case 'LT':
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 'EQ':
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$String$trim = _String_trim;
var $techbelly$elm_zmachine$ZMachine$Window$splitOnSpacesHelp = F5(
	function (chars, current, segments, inGap, gapLen) {
		splitOnSpacesHelp:
		while (true) {
			if (!chars.b) {
				var _final = $elm$core$String$trim(
					$elm$core$String$fromList(
						$elm$core$List$reverse(current)));
				return $elm$core$List$reverse(
					$elm$core$String$isEmpty(_final) ? segments : A2($elm$core$List$cons, _final, segments));
			} else {
				if (' ' === chars.a.valueOf()) {
					var rest = chars.b;
					if (inGap) {
						var $temp$chars = rest,
							$temp$current = current,
							$temp$segments = segments,
							$temp$inGap = true,
							$temp$gapLen = gapLen + 1;
						chars = $temp$chars;
						current = $temp$current;
						segments = $temp$segments;
						inGap = $temp$inGap;
						gapLen = $temp$gapLen;
						continue splitOnSpacesHelp;
					} else {
						var $temp$chars = rest,
							$temp$current = A2(
							$elm$core$List$cons,
							_Utils_chr(' '),
							current),
							$temp$segments = segments,
							$temp$inGap = true,
							$temp$gapLen = 1;
						chars = $temp$chars;
						current = $temp$current;
						segments = $temp$segments;
						inGap = $temp$inGap;
						gapLen = $temp$gapLen;
						continue splitOnSpacesHelp;
					}
				} else {
					var ch = chars.a;
					var rest = chars.b;
					if (inGap && (gapLen >= 3)) {
						var seg = $elm$core$String$trim(
							$elm$core$String$fromList(
								$elm$core$List$reverse(current)));
						var $temp$chars = rest,
							$temp$current = _List_fromArray(
							[ch]),
							$temp$segments = $elm$core$String$isEmpty(seg) ? segments : A2($elm$core$List$cons, seg, segments),
							$temp$inGap = false,
							$temp$gapLen = 0;
						chars = $temp$chars;
						current = $temp$current;
						segments = $temp$segments;
						inGap = $temp$inGap;
						gapLen = $temp$gapLen;
						continue splitOnSpacesHelp;
					} else {
						var $temp$chars = rest,
							$temp$current = A2($elm$core$List$cons, ch, current),
							$temp$segments = segments,
							$temp$inGap = false,
							$temp$gapLen = 0;
						chars = $temp$chars;
						current = $temp$current;
						segments = $temp$segments;
						inGap = $temp$inGap;
						gapLen = $temp$gapLen;
						continue splitOnSpacesHelp;
					}
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Window$splitOnSpaces = function (str) {
	return A5(
		$techbelly$elm_zmachine$ZMachine$Window$splitOnSpacesHelp,
		$elm$core$String$toList(str),
		_List_Nil,
		_List_Nil,
		false,
		0);
};
var $techbelly$elm_zmachine$ZMachine$Window$renderRow = function (row) {
	var full = $elm$core$String$trim(
		$elm$core$String$fromList(
			$elm$core$Array$toList(row)));
	return $elm$core$String$isEmpty(full) ? '' : A2(
		$elm$core$String$join,
		'  ',
		$techbelly$elm_zmachine$ZMachine$Window$splitOnSpaces(full));
};
var $techbelly$elm_zmachine$ZMachine$Window$render = function (uw) {
	return A2(
		$elm$core$List$filter,
		A2($elm$core$Basics$composeL, $elm$core$Basics$not, $elm$core$String$isEmpty),
		A2(
			$elm$core$List$filterMap,
			function (r) {
				return A2(
					$elm$core$Maybe$map,
					$techbelly$elm_zmachine$ZMachine$Window$renderRow,
					A2($elm$core$Dict$get, r, uw.rows));
			},
			A2(
				$elm$core$List$range,
				1,
				A2($elm$core$Basics$max, uw.height, 1))));
};
var $techbelly$elm_zmachine$ZMachine$State$flushUpperWindow = function (machine) {
	var rows = $techbelly$elm_zmachine$ZMachine$Window$render(machine.upperWindow);
	var _v0 = function () {
		var _v1 = A2($techbelly$elm_zmachine$ZMachine$Player$currentLocation, machine.memory, machine.playerTracking);
		if (!_v1.a) {
			var obj = machine.upperWindow.firstPrintedObj;
			return (!obj) ? _Utils_Tuple2(0, '') : _Utils_Tuple2(
				obj,
				A2($techbelly$elm_zmachine$ZMachine$ObjectTable$shortName, obj, machine.memory));
		} else {
			var result = _v1;
			return result;
		}
	}();
	var locId = _v0.a;
	var locName = _v0.b;
	if (!rows.b) {
		return machine;
	} else {
		return A2(
			$techbelly$elm_zmachine$ZMachine$State$appendOutput,
			$techbelly$elm_zmachine$ZMachine$Types$ShowStatusLine(
				{
					locationId: locId,
					locationName: locName,
					mode: $techbelly$elm_zmachine$ZMachine$Types$ScreenRows(rows)
				}),
			machine);
	}
};
var $techbelly$elm_zmachine$ZMachine$Run$drain = function (outcome) {
	var drainMachine = function (m) {
		var flushed = $techbelly$elm_zmachine$ZMachine$State$flushUpperWindow(m);
		return _Utils_Tuple2(
			$elm$core$List$reverse(flushed.output),
			_Utils_update(
				flushed,
				{output: _List_Nil}));
	};
	switch (outcome.$) {
		case 'Continue':
			var m = outcome.a;
			var _v1 = drainMachine(m);
			var events = _v1.a;
			var cleaned = _v1.b;
			return A2($techbelly$elm_zmachine$ZMachine$Types$Continue, events, cleaned);
		case 'NeedInput':
			var info = outcome.a;
			var m = outcome.b;
			var _v2 = drainMachine(m);
			var events = _v2.a;
			var cleaned = _v2.b;
			return A3($techbelly$elm_zmachine$ZMachine$Types$NeedInput, info, events, cleaned);
		case 'NeedChar':
			var m = outcome.a;
			var _v3 = drainMachine(m);
			var events = _v3.a;
			var cleaned = _v3.b;
			return A2($techbelly$elm_zmachine$ZMachine$Types$NeedChar, events, cleaned);
		case 'NeedSave':
			var snap = outcome.a;
			var m = outcome.b;
			var _v4 = drainMachine(m);
			var events = _v4.a;
			var cleaned = _v4.b;
			return A3($techbelly$elm_zmachine$ZMachine$Types$NeedSave, snap, events, cleaned);
		case 'NeedRestore':
			var m = outcome.a;
			var _v5 = drainMachine(m);
			var events = _v5.a;
			var cleaned = _v5.b;
			return A2($techbelly$elm_zmachine$ZMachine$Types$NeedRestore, events, cleaned);
		case 'Halted':
			var m = outcome.a;
			var _v6 = drainMachine(m);
			var events = _v6.a;
			var cleaned = _v6.b;
			return A2($techbelly$elm_zmachine$ZMachine$Types$Halted, events, cleaned);
		default:
			var err = outcome.a;
			var m = outcome.b;
			var _v7 = drainMachine(m);
			var events = _v7.a;
			var cleaned = _v7.b;
			return A3($techbelly$elm_zmachine$ZMachine$Types$Error, err, events, cleaned);
	}
};
var $techbelly$elm_zmachine$ZMachine$Execute$Continue = function (a) {
	return {$: 'Continue', a: a};
};
var $techbelly$elm_zmachine$ZMachine$State$firstGlobalVariable = 16;
var $techbelly$elm_zmachine$ZMachine$State$globalAddress = F2(
	function (n, mem) {
		return $techbelly$elm_zmachine$ZMachine$Header$globalVariablesAddress(mem) + ((n - $techbelly$elm_zmachine$ZMachine$State$firstGlobalVariable) * $techbelly$elm_zmachine$ZMachine$Memory$wordLength);
	});
var $techbelly$elm_zmachine$Library$IntExtra$toUnsignedInt16 = function (n) {
	return n & 65535;
};
var $techbelly$elm_zmachine$ZMachine$State$pushStack = F2(
	function (value, machine) {
		return _Utils_update(
			machine,
			{
				stack: A2(
					$elm$core$List$cons,
					$techbelly$elm_zmachine$Library$IntExtra$toUnsignedInt16(value),
					machine.stack)
			});
	});
var $techbelly$elm_zmachine$ZMachine$Stack$setLocal = F3(
	function (n, value, frame) {
		return _Utils_update(
			frame,
			{
				locals: A3(
					$elm$core$Array$set,
					n - 1,
					$techbelly$elm_zmachine$Library$IntExtra$toUnsignedInt16(value),
					frame.locals)
			});
	});
var $techbelly$elm_zmachine$ZMachine$State$writeVariable = F3(
	function (ref, value, machine) {
		switch (ref.$) {
			case 'Stack':
				return A2($techbelly$elm_zmachine$ZMachine$State$pushStack, value, machine);
			case 'Local':
				var n = ref.a;
				var _v1 = machine.callStack;
				if (_v1.b) {
					var frame = _v1.a;
					var rest = _v1.b;
					return _Utils_update(
						machine,
						{
							callStack: A2(
								$elm$core$List$cons,
								A3($techbelly$elm_zmachine$ZMachine$Stack$setLocal, n, value, frame),
								rest)
						});
				} else {
					return machine;
				}
			default:
				var n = ref.a;
				return _Utils_update(
					machine,
					{
						memory: A3(
							$techbelly$elm_zmachine$ZMachine$Memory$writeWord,
							A2($techbelly$elm_zmachine$ZMachine$State$globalAddress, n, machine.memory),
							value,
							machine.memory)
					});
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$storeResult = F3(
	function (instr, value, machine) {
		var _v0 = instr.store;
		if (_v0.$ === 'Just') {
			var varRef = _v0.a;
			return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
				A3($techbelly$elm_zmachine$ZMachine$State$writeVariable, varRef, value, machine));
		} else {
			return $techbelly$elm_zmachine$ZMachine$Execute$Continue(machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$storeInstr = F3(
	function (instr, value, machine) {
		return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, value, machine);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $techbelly$elm_zmachine$ZMachine$Dictionary$readEntryKey = F3(
	function (numWords, addr, mem) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, addr + (i * $techbelly$elm_zmachine$ZMachine$Memory$wordLength), mem);
			},
			A2($elm$core$List$range, 0, numWords - 1));
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$binarySearch = F7(
	function (entriesStart, entryLength, numWords, low, high, target, mem) {
		binarySearch:
		while (true) {
			if (_Utils_cmp(low, high) > 0) {
				return 0;
			} else {
				var mid = ((low + high) / 2) | 0;
				var midAddr = entriesStart + (mid * entryLength);
				var midKey = A3($techbelly$elm_zmachine$ZMachine$Dictionary$readEntryKey, numWords, midAddr, mem);
				if (_Utils_eq(midKey, target)) {
					return midAddr;
				} else {
					if (_Utils_cmp(target, midKey) < 0) {
						var $temp$entriesStart = entriesStart,
							$temp$entryLength = entryLength,
							$temp$numWords = numWords,
							$temp$low = low,
							$temp$high = mid - 1,
							$temp$target = target,
							$temp$mem = mem;
						entriesStart = $temp$entriesStart;
						entryLength = $temp$entryLength;
						numWords = $temp$numWords;
						low = $temp$low;
						high = $temp$high;
						target = $temp$target;
						mem = $temp$mem;
						continue binarySearch;
					} else {
						var $temp$entriesStart = entriesStart,
							$temp$entryLength = entryLength,
							$temp$numWords = numWords,
							$temp$low = mid + 1,
							$temp$high = high,
							$temp$target = target,
							$temp$mem = mem;
						entriesStart = $temp$entriesStart;
						entryLength = $temp$entryLength;
						numWords = $temp$numWords;
						low = $temp$low;
						high = $temp$high;
						target = $temp$target;
						mem = $temp$mem;
						continue binarySearch;
					}
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Header$dictionaryAddress = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 8, mem);
};
var $techbelly$elm_zmachine$ZMachine$Text$charToZscii = function (ch) {
	if (_Utils_eq(
		ch,
		_Utils_chr('\n'))) {
		return $elm$core$Maybe$Just(13);
	} else {
		var code = $elm$core$Char$toCode(ch);
		return ((code >= 32) && (code <= 126)) ? $elm$core$Maybe$Just(code) : $elm$core$Maybe$Nothing;
	}
};
var $techbelly$elm_zmachine$Library$ListExtra$findIndexHelper = F3(
	function (target, list, idx) {
		findIndexHelper:
		while (true) {
			if (!list.b) {
				return $elm$core$Maybe$Nothing;
			} else {
				var x = list.a;
				var rest = list.b;
				if (_Utils_eq(x, target)) {
					return $elm$core$Maybe$Just(idx);
				} else {
					var $temp$target = target,
						$temp$list = rest,
						$temp$idx = idx + 1;
					target = $temp$target;
					list = $temp$list;
					idx = $temp$idx;
					continue findIndexHelper;
				}
			}
		}
	});
var $techbelly$elm_zmachine$Library$ListExtra$findIndex = F2(
	function (target, list) {
		return A3($techbelly$elm_zmachine$Library$ListExtra$findIndexHelper, target, list, 0);
	});
var $techbelly$elm_zmachine$ZMachine$Text$findInAlphabet = F2(
	function (alphabet, ch) {
		var table = function () {
			switch (alphabet) {
				case 0:
					return $techbelly$elm_zmachine$ZMachine$Text$a0;
				case 1:
					return $techbelly$elm_zmachine$ZMachine$Text$a1;
				default:
					return $techbelly$elm_zmachine$ZMachine$Text$a2;
			}
		}();
		return A2(
			$elm$core$Maybe$map,
			function (i) {
				return i + 6;
			},
			A2($techbelly$elm_zmachine$Library$ListExtra$findIndex, ch, table));
	});
var $techbelly$elm_zmachine$ZMachine$Text$charToZCharSequence = function (ch) {
	var _v0 = A2($techbelly$elm_zmachine$ZMachine$Text$findInAlphabet, 0, ch);
	if (_v0.$ === 'Just') {
		var zchar = _v0.a;
		return _List_fromArray(
			[zchar]);
	} else {
		var _v1 = A2($techbelly$elm_zmachine$ZMachine$Text$findInAlphabet, 1, ch);
		if (_v1.$ === 'Just') {
			var zchar = _v1.a;
			return _List_fromArray(
				[$techbelly$elm_zmachine$ZMachine$Text$a1Shift, zchar]);
		} else {
			var _v2 = A2($techbelly$elm_zmachine$ZMachine$Text$findInAlphabet, 2, ch);
			if (_v2.$ === 'Just') {
				var zchar = _v2.a;
				return _List_fromArray(
					[$techbelly$elm_zmachine$ZMachine$Text$a2Shift, zchar]);
			} else {
				var _v3 = $techbelly$elm_zmachine$ZMachine$Text$charToZscii(ch);
				if (_v3.$ === 'Just') {
					var code = _v3.a;
					return _List_fromArray(
						[$techbelly$elm_zmachine$ZMachine$Text$a2Shift, $techbelly$elm_zmachine$ZMachine$Text$zsciiEscape, (code >>> $techbelly$elm_zmachine$ZMachine$Text$zcharBits) & $techbelly$elm_zmachine$ZMachine$Text$zcharMask, code & $techbelly$elm_zmachine$ZMachine$Text$zcharMask]);
				} else {
					return _List_Nil;
				}
			}
		}
	}
};
var $techbelly$elm_zmachine$ZMachine$Text$dictionaryPadChar = 5;
var $elm$core$List$repeatHelp = F3(
	function (result, n, value) {
		repeatHelp:
		while (true) {
			if (n <= 0) {
				return result;
			} else {
				var $temp$result = A2($elm$core$List$cons, value, result),
					$temp$n = n - 1,
					$temp$value = value;
				result = $temp$result;
				n = $temp$n;
				value = $temp$value;
				continue repeatHelp;
			}
		}
	});
var $elm$core$List$repeat = F2(
	function (n, value) {
		return A3($elm$core$List$repeatHelp, _List_Nil, n, value);
	});
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $techbelly$elm_zmachine$Library$ListExtra$padTo = F3(
	function (length, fill, list) {
		var truncated = A2($elm$core$List$take, length, list);
		var missing = length - $elm$core$List$length(truncated);
		return _Utils_ap(
			truncated,
			A2($elm$core$List$repeat, missing, fill));
	});
var $elm$core$String$toLower = _String_toLower;
var $techbelly$elm_zmachine$ZMachine$Text$encodeToZChars = F2(
	function (mem, str) {
		return A3(
			$techbelly$elm_zmachine$Library$ListExtra$padTo,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).dictWordZChars,
			$techbelly$elm_zmachine$ZMachine$Text$dictionaryPadChar,
			A2(
				$elm$core$List$concatMap,
				$techbelly$elm_zmachine$ZMachine$Text$charToZCharSequence,
				$elm$core$String$toList(
					$elm$core$String$toLower(str))));
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$linearSearchHelper = F7(
	function (entriesStart, entryLength, numWords, index, count, target, mem) {
		linearSearchHelper:
		while (true) {
			if (_Utils_cmp(index, count) > -1) {
				return 0;
			} else {
				var addr = entriesStart + (index * entryLength);
				var key = A3($techbelly$elm_zmachine$ZMachine$Dictionary$readEntryKey, numWords, addr, mem);
				if (_Utils_eq(key, target)) {
					return addr;
				} else {
					var $temp$entriesStart = entriesStart,
						$temp$entryLength = entryLength,
						$temp$numWords = numWords,
						$temp$index = index + 1,
						$temp$count = count,
						$temp$target = target,
						$temp$mem = mem;
					entriesStart = $temp$entriesStart;
					entryLength = $temp$entryLength;
					numWords = $temp$numWords;
					index = $temp$index;
					count = $temp$count;
					target = $temp$target;
					mem = $temp$mem;
					continue linearSearchHelper;
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$linearSearch = F6(
	function (entriesStart, entryLength, numWords, count, target, mem) {
		return A7($techbelly$elm_zmachine$ZMachine$Dictionary$linearSearchHelper, entriesStart, entryLength, numWords, 0, count, target, mem);
	});
var $techbelly$elm_zmachine$ZMachine$Text$packThreeZChars = F2(
	function (chars, isLast) {
		var z3 = A2(
			$elm$core$Maybe$withDefault,
			$techbelly$elm_zmachine$ZMachine$Text$dictionaryPadChar,
			A2($techbelly$elm_zmachine$Library$ListExtra$getAt, 2, chars));
		var z2 = A2(
			$elm$core$Maybe$withDefault,
			$techbelly$elm_zmachine$ZMachine$Text$dictionaryPadChar,
			A2($techbelly$elm_zmachine$Library$ListExtra$getAt, 1, chars));
		var z1 = A2(
			$elm$core$Maybe$withDefault,
			$techbelly$elm_zmachine$ZMachine$Text$dictionaryPadChar,
			A2($techbelly$elm_zmachine$Library$ListExtra$getAt, 0, chars));
		var topBit = isLast ? 32768 : 0;
		return z3 | ((z2 << $techbelly$elm_zmachine$ZMachine$Text$zcharBits) | ((z1 << (2 * $techbelly$elm_zmachine$ZMachine$Text$zcharBits)) | topBit));
	});
var $techbelly$elm_zmachine$ZMachine$Text$packZCharsToWords = F2(
	function (mem, zchars) {
		var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem);
		var padded = A3($techbelly$elm_zmachine$Library$ListExtra$padTo, p.dictWordZChars, $techbelly$elm_zmachine$ZMachine$Text$dictionaryPadChar, zchars);
		var numWords = p.dictWordWords;
		return A2(
			$elm$core$List$map,
			function (i) {
				return A2(
					$techbelly$elm_zmachine$ZMachine$Text$packThreeZChars,
					A2(
						$elm$core$List$take,
						3,
						A2($elm$core$List$drop, i * 3, padded)),
					_Utils_eq(i, numWords - 1));
			},
			A2($elm$core$List$range, 0, numWords - 1));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$readSignedWord = F2(
	function (addr, mem) {
		var unsigned = A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, addr, mem);
		return (unsigned > 32767) ? (unsigned - 65536) : unsigned;
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$lookupWord = F2(
	function (word, mem) {
		var zchars = A2($techbelly$elm_zmachine$ZMachine$Text$encodeToZChars, mem, word);
		var target = A2($techbelly$elm_zmachine$ZMachine$Text$packZCharsToWords, mem, zchars);
		var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem);
		var dictAddr = $techbelly$elm_zmachine$ZMachine$Header$dictionaryAddress(mem);
		var numSeparators = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, dictAddr, mem);
		var entriesStart = (dictAddr + 4) + numSeparators;
		var entryLength = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, (dictAddr + 1) + numSeparators, mem);
		var numEntries = A2($techbelly$elm_zmachine$ZMachine$Memory$readSignedWord, (dictAddr + 2) + numSeparators, mem);
		return (numEntries >= 0) ? A7($techbelly$elm_zmachine$ZMachine$Dictionary$binarySearch, entriesStart, entryLength, p.dictWordWords, 0, numEntries - 1, target, mem) : A6(
			$techbelly$elm_zmachine$ZMachine$Dictionary$linearSearch,
			entriesStart,
			entryLength,
			p.dictWordWords,
			$elm$core$Basics$abs(numEntries),
			target,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$readSeparators = function (mem) {
	var dictAddr = $techbelly$elm_zmachine$ZMachine$Header$dictionaryAddress(mem);
	var count = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, dictAddr, mem);
	return A2(
		$elm$core$List$map,
		function (i) {
			return $elm$core$Char$fromCode(
				A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, dictAddr + i, mem));
		},
		A2($elm$core$List$range, 1, count));
};
var $elm$core$String$cons = _String_cons;
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$splitHelper = F5(
	function (chars, separators, pos, currentWord, tokens) {
		splitHelper:
		while (true) {
			var flushed = function () {
				if ($elm$core$List$isEmpty(currentWord)) {
					return tokens;
				} else {
					var wordStart = pos - $elm$core$List$length(currentWord);
					var word = $elm$core$String$fromList(
						$elm$core$List$reverse(currentWord));
					return A2(
						$elm$core$List$cons,
						{
							length: $elm$core$String$length(word),
							position: wordStart,
							text: word
						},
						tokens);
				}
			}();
			if (!chars.b) {
				return $elm$core$List$reverse(flushed);
			} else {
				var ch = chars.a;
				var rest = chars.b;
				if (_Utils_eq(
					ch,
					_Utils_chr(' '))) {
					var $temp$chars = rest,
						$temp$separators = separators,
						$temp$pos = pos + 1,
						$temp$currentWord = _List_Nil,
						$temp$tokens = flushed;
					chars = $temp$chars;
					separators = $temp$separators;
					pos = $temp$pos;
					currentWord = $temp$currentWord;
					tokens = $temp$tokens;
					continue splitHelper;
				} else {
					if (A2($elm$core$List$member, ch, separators)) {
						var sepToken = {
							length: 1,
							position: pos,
							text: $elm$core$String$fromChar(ch)
						};
						var $temp$chars = rest,
							$temp$separators = separators,
							$temp$pos = pos + 1,
							$temp$currentWord = _List_Nil,
							$temp$tokens = A2($elm$core$List$cons, sepToken, flushed);
						chars = $temp$chars;
						separators = $temp$separators;
						pos = $temp$pos;
						currentWord = $temp$currentWord;
						tokens = $temp$tokens;
						continue splitHelper;
					} else {
						var $temp$chars = rest,
							$temp$separators = separators,
							$temp$pos = pos + 1,
							$temp$currentWord = A2($elm$core$List$cons, ch, currentWord),
							$temp$tokens = tokens;
						chars = $temp$chars;
						separators = $temp$separators;
						pos = $temp$pos;
						currentWord = $temp$currentWord;
						tokens = $temp$tokens;
						continue splitHelper;
					}
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$splitIntoWords = F2(
	function (input, separators) {
		return A5(
			$techbelly$elm_zmachine$ZMachine$Dictionary$splitHelper,
			$elm$core$String$toList(input),
			separators,
			0,
			_List_Nil,
			_List_Nil);
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$writeParseBuffer = F3(
	function (results, parseBufAddr, mem) {
		var memWithCount = A3(
			$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
			parseBufAddr + 1,
			$elm$core$List$length(results),
			mem);
		return A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, m) {
					var i = _v0.a;
					var token = _v0.b;
					var entryAddr = (parseBufAddr + 2) + (i * 4);
					return A3(
						$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
						entryAddr + 3,
						token.textPosition,
						A3(
							$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
							entryAddr + 2,
							token.textLength,
							A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, entryAddr, token.dictAddr, m)));
				}),
			memWithCount,
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, results));
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$writeTextBuffer = F3(
	function (text, addr, mem) {
		var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem);
		var offset = p.textBufferOffset;
		var chars = $elm$core$String$toList(text);
		var memWithChars = A3(
			$elm$core$List$foldl,
			F2(
				function (_v1, m) {
					var i = _v1.a;
					var ch = _v1.b;
					return A3(
						$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
						(addr + offset) + i,
						$elm$core$Char$toCode(ch),
						m);
				}),
			mem,
			A2($elm$core$List$indexedMap, $elm$core$Tuple$pair, chars));
		var _v0 = p.version;
		if (_v0.$ === 'V3') {
			return A3(
				$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
				(addr + offset) + $elm$core$List$length(chars),
				0,
				memWithChars);
		} else {
			return A3(
				$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
				addr + 1,
				$elm$core$List$length(chars),
				memWithChars);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Dictionary$tokenize = F4(
	function (input, textBufAddr, parseBufAddr, mem) {
		var textOffset = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem).textBufferOffset;
		var separators = $techbelly$elm_zmachine$ZMachine$Dictionary$readSeparators(mem);
		var maxWords = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, parseBufAddr, mem);
		var lowered = $elm$core$String$toLower(input);
		var memWithText = A3($techbelly$elm_zmachine$ZMachine$Dictionary$writeTextBuffer, lowered, textBufAddr, mem);
		var tokens = A2($techbelly$elm_zmachine$ZMachine$Dictionary$splitIntoWords, lowered, separators);
		var tokenResults = A2(
			$elm$core$List$map,
			function (token) {
				return {
					dictAddr: A2($techbelly$elm_zmachine$ZMachine$Dictionary$lookupWord, token.text, mem),
					textLength: token.length,
					textPosition: token.position + textOffset
				};
			},
			A2($elm$core$List$take, maxWords, tokens));
		return A3($techbelly$elm_zmachine$ZMachine$Dictionary$writeParseBuffer, tokenResults, parseBufAddr, memWithText);
	});
var $techbelly$elm_zmachine$ZMachine$Run$provideInput = F3(
	function (input, info, machine) {
		var version = $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory).version;
		var truncated = A2($elm$core$String$left, info.maxLength, input);
		var mem = A4($techbelly$elm_zmachine$ZMachine$Dictionary$tokenize, truncated, info.textBufferAddr, info.parseBufferAddr, machine.memory);
		var instr = A2($techbelly$elm_zmachine$ZMachine$Decode$decode, machine.pc, machine.memory);
		var nextPC = machine.pc + instr.length;
		var advanced = _Utils_update(
			machine,
			{memory: mem, pc: nextPC});
		if (version.$ === 'V5') {
			return $techbelly$elm_zmachine$ZMachine$Run$drain(
				A3($techbelly$elm_zmachine$ZMachine$Execute$storeInstr, instr, 13, advanced));
		} else {
			return A2($techbelly$elm_zmachine$ZMachine$Types$Continue, _List_Nil, advanced);
		}
	});
var $techbelly$elm_zmachine$ZMachine$provideInput = $techbelly$elm_zmachine$ZMachine$Run$provideInput;
var $elm$core$String$dropRight = F2(
	function (n, string) {
		return (n < 1) ? string : A3($elm$core$String$slice, 0, -n, string);
	});
var $elm$core$String$endsWith = _String_endsWith;
var $techbelly$elm_zengine$ZEngine$stripTrailingNewline = function (s) {
	return A2($elm$core$String$endsWith, '\n', s) ? A2($elm$core$String$dropRight, 1, s) : s;
};
var $techbelly$elm_zengine$ZEngine$truncateInput = F2(
	function (req, input) {
		return A2($elm$core$String$left, req.maxLength, input);
	});
var $techbelly$elm_zengine$ZEngine$sendLine = F3(
	function (tagger, input, _v0) {
		var state = _v0.a;
		var command = $techbelly$elm_zengine$ZEngine$stripTrailingNewline(input);
		return A2(
			$techbelly$elm_zengine$ZEngine$mapStep,
			tagger,
			function () {
				var _v1 = _Utils_Tuple2(state.phase, state.activePrompt);
				_v1$3:
				while (true) {
					switch (_v1.a.$) {
						case 'Waiting':
							if ((_v1.b.$ === 'Just') && (_v1.b.a.$ === 'LineActive')) {
								var _v2 = _v1.a;
								var req = _v1.b.a.a;
								var truncated = A2($techbelly$elm_zengine$ZEngine$truncateInput, req, command);
								var newTranscript = _Utils_ap(
									state.transcript,
									_List_fromArray(
										[
											$techbelly$elm_zengine$ZEngine$Types$InputFrame(
											{command: truncated})
										]));
								var newState = _Utils_update(
									state,
									{activePrompt: $elm$core$Maybe$Nothing, phase: $techbelly$elm_zengine$ZEngine$Internal$Running, transcript: newTranscript});
								return A3(
									$techbelly$elm_zengine$ZEngine$okStep,
									$techbelly$elm_zengine$ZEngine$Session(newState),
									_List_Nil,
									A2(
										$elm$core$Task$perform,
										function (_v3) {
											return $techbelly$elm_zengine$ZEngine$StepCompleted(
												A3($techbelly$elm_zmachine$ZMachine$provideInput, truncated, req, state.machine));
										},
										$elm$core$Task$succeed(_Utils_Tuple0)));
							} else {
								break _v1$3;
							}
						case 'Loading':
							var _v4 = _v1.a;
							return A3(
								$techbelly$elm_zengine$ZEngine$okStep,
								$techbelly$elm_zengine$ZEngine$Session(
									_Utils_update(
										state,
										{
											inputQueue: _Utils_ap(
												state.inputQueue,
												_List_fromArray(
													[command]))
										})),
								_List_Nil,
								$elm$core$Platform$Cmd$none);
						case 'Running':
							var _v5 = _v1.a;
							return A3(
								$techbelly$elm_zengine$ZEngine$okStep,
								$techbelly$elm_zengine$ZEngine$Session(
									_Utils_update(
										state,
										{
											inputQueue: _Utils_ap(
												state.inputQueue,
												_List_fromArray(
													[command]))
										})),
								_List_Nil,
								$elm$core$Platform$Cmd$none);
						default:
							break _v1$3;
					}
				}
				return A3(
					$techbelly$elm_zengine$ZEngine$okStep,
					$techbelly$elm_zengine$ZEngine$Session(state),
					_List_Nil,
					$elm$core$Platform$Cmd$none);
			}());
	});
var $elm$file$File$toBytes = _File_toBytes;
var $techbelly$elm_zengine$ZEngine$Internal$CharActive = {$: 'CharActive'};
var $techbelly$elm_zengine$ZEngine$CharPrompt = {$: 'CharPrompt'};
var $techbelly$elm_zengine$ZEngine$Internal$Errored = function (a) {
	return {$: 'Errored', a: a};
};
var $techbelly$elm_zengine$ZEngine$GameOver = {$: 'GameOver'};
var $techbelly$elm_zengine$ZEngine$Internal$Halted = {$: 'Halted'};
var $techbelly$elm_zengine$ZEngine$Types$OutputFrame = function (a) {
	return {$: 'OutputFrame', a: a};
};
var $techbelly$elm_zengine$ZEngine$OutputProduced = function (a) {
	return {$: 'OutputProduced', a: a};
};
var $techbelly$elm_zengine$ZEngine$Internal$RestoreActive = {$: 'RestoreActive'};
var $techbelly$elm_zengine$ZEngine$RestorePrompt = {$: 'RestorePrompt'};
var $techbelly$elm_zengine$ZEngine$Internal$SaveActive = function (a) {
	return {$: 'SaveActive', a: a};
};
var $techbelly$elm_zengine$ZEngine$SavePrompt = function (a) {
	return {$: 'SavePrompt', a: a};
};
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $techbelly$elm_zmachine$Library$CMem$compressHelp = F6(
	function (original, current, i, len, zeroRun, acc) {
		compressHelp:
		while (true) {
			if (_Utils_cmp(i, len) > -1) {
				return acc;
			} else {
				var orig = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm$core$Array$get, i, original));
				var cur = A2(
					$elm$core$Maybe$withDefault,
					0,
					A2($elm$core$Array$get, i, current));
				var xor = 255 & (orig ^ cur);
				if (!xor) {
					if (zeroRun >= 255) {
						var $temp$original = original,
							$temp$current = current,
							$temp$i = i + 1,
							$temp$len = len,
							$temp$zeroRun = 0,
							$temp$acc = A2(
							$elm$core$List$cons,
							255,
							A2($elm$core$List$cons, 0, acc));
						original = $temp$original;
						current = $temp$current;
						i = $temp$i;
						len = $temp$len;
						zeroRun = $temp$zeroRun;
						acc = $temp$acc;
						continue compressHelp;
					} else {
						var $temp$original = original,
							$temp$current = current,
							$temp$i = i + 1,
							$temp$len = len,
							$temp$zeroRun = zeroRun + 1,
							$temp$acc = acc;
						original = $temp$original;
						current = $temp$current;
						i = $temp$i;
						len = $temp$len;
						zeroRun = $temp$zeroRun;
						acc = $temp$acc;
						continue compressHelp;
					}
				} else {
					var flushed = (zeroRun > 0) ? A2(
						$elm$core$List$cons,
						xor,
						A2(
							$elm$core$List$cons,
							zeroRun - 1,
							A2($elm$core$List$cons, 0, acc))) : A2($elm$core$List$cons, xor, acc);
					var $temp$original = original,
						$temp$current = current,
						$temp$i = i + 1,
						$temp$len = len,
						$temp$zeroRun = 0,
						$temp$acc = flushed;
					original = $temp$original;
					current = $temp$current;
					i = $temp$i;
					len = $temp$len;
					zeroRun = $temp$zeroRun;
					acc = $temp$acc;
					continue compressHelp;
				}
			}
		}
	});
var $elm$core$Array$length = function (_v0) {
	var len = _v0.a;
	return len;
};
var $techbelly$elm_zmachine$Library$CMem$compress = function (_v0) {
	var original = _v0.original;
	var current = _v0.current;
	var len = $elm$core$Array$length(original);
	return $elm$core$List$reverse(
		A6($techbelly$elm_zmachine$Library$CMem$compressHelp, original, current, 0, len, 0, _List_Nil));
};
var $elm$core$Elm$JsArray$appendN = _JsArray_appendN;
var $elm$core$Elm$JsArray$slice = _JsArray_slice;
var $elm$core$Array$appendHelpBuilder = F2(
	function (tail, builder) {
		var tailLen = $elm$core$Elm$JsArray$length(tail);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(builder.tail)) - tailLen;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, builder.tail, tail);
		return (notAppended < 0) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: A3($elm$core$Elm$JsArray$slice, notAppended, tailLen, tail)
		} : ((!notAppended) ? {
			nodeList: A2(
				$elm$core$List$cons,
				$elm$core$Array$Leaf(appended),
				builder.nodeList),
			nodeListSize: builder.nodeListSize + 1,
			tail: $elm$core$Elm$JsArray$empty
		} : {nodeList: builder.nodeList, nodeListSize: builder.nodeListSize, tail: appended});
	});
var $elm$core$Array$sliceLeft = F2(
	function (from, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		if (!from) {
			return array;
		} else {
			if (_Utils_cmp(
				from,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					len - from,
					$elm$core$Array$shiftStep,
					$elm$core$Elm$JsArray$empty,
					A3(
						$elm$core$Elm$JsArray$slice,
						from - $elm$core$Array$tailIndex(len),
						$elm$core$Elm$JsArray$length(tail),
						tail));
			} else {
				var skipNodes = (from / $elm$core$Array$branchFactor) | 0;
				var helper = F2(
					function (node, acc) {
						if (node.$ === 'SubTree') {
							var subTree = node.a;
							return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
						} else {
							var leaf = node.a;
							return A2($elm$core$List$cons, leaf, acc);
						}
					});
				var leafNodes = A3(
					$elm$core$Elm$JsArray$foldr,
					helper,
					_List_fromArray(
						[tail]),
					tree);
				var nodesToInsert = A2($elm$core$List$drop, skipNodes, leafNodes);
				if (!nodesToInsert.b) {
					return $elm$core$Array$empty;
				} else {
					var head = nodesToInsert.a;
					var rest = nodesToInsert.b;
					var firstSlice = from - (skipNodes * $elm$core$Array$branchFactor);
					var initialBuilder = {
						nodeList: _List_Nil,
						nodeListSize: 0,
						tail: A3(
							$elm$core$Elm$JsArray$slice,
							firstSlice,
							$elm$core$Elm$JsArray$length(head),
							head)
					};
					return A2(
						$elm$core$Array$builderToArray,
						true,
						A3($elm$core$List$foldl, $elm$core$Array$appendHelpBuilder, initialBuilder, rest));
				}
			}
		}
	});
var $elm$core$Array$fetchNewTail = F4(
	function (shift, end, treeEnd, tree) {
		fetchNewTail:
		while (true) {
			var pos = $elm$core$Array$bitMask & (treeEnd >>> shift);
			var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, pos, tree);
			if (_v0.$ === 'SubTree') {
				var sub = _v0.a;
				var $temp$shift = shift - $elm$core$Array$shiftStep,
					$temp$end = end,
					$temp$treeEnd = treeEnd,
					$temp$tree = sub;
				shift = $temp$shift;
				end = $temp$end;
				treeEnd = $temp$treeEnd;
				tree = $temp$tree;
				continue fetchNewTail;
			} else {
				var values = _v0.a;
				return A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, values);
			}
		}
	});
var $elm$core$Array$hoistTree = F3(
	function (oldShift, newShift, tree) {
		hoistTree:
		while (true) {
			if ((_Utils_cmp(oldShift, newShift) < 1) || (!$elm$core$Elm$JsArray$length(tree))) {
				return tree;
			} else {
				var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, 0, tree);
				if (_v0.$ === 'SubTree') {
					var sub = _v0.a;
					var $temp$oldShift = oldShift - $elm$core$Array$shiftStep,
						$temp$newShift = newShift,
						$temp$tree = sub;
					oldShift = $temp$oldShift;
					newShift = $temp$newShift;
					tree = $temp$tree;
					continue hoistTree;
				} else {
					return tree;
				}
			}
		}
	});
var $elm$core$Array$sliceTree = F3(
	function (shift, endIdx, tree) {
		var lastPos = $elm$core$Array$bitMask & (endIdx >>> shift);
		var _v0 = A2($elm$core$Elm$JsArray$unsafeGet, lastPos, tree);
		if (_v0.$ === 'SubTree') {
			var sub = _v0.a;
			var newSub = A3($elm$core$Array$sliceTree, shift - $elm$core$Array$shiftStep, endIdx, sub);
			return (!$elm$core$Elm$JsArray$length(newSub)) ? A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree) : A3(
				$elm$core$Elm$JsArray$unsafeSet,
				lastPos,
				$elm$core$Array$SubTree(newSub),
				A3($elm$core$Elm$JsArray$slice, 0, lastPos + 1, tree));
		} else {
			return A3($elm$core$Elm$JsArray$slice, 0, lastPos, tree);
		}
	});
var $elm$core$Array$sliceRight = F2(
	function (end, array) {
		var len = array.a;
		var startShift = array.b;
		var tree = array.c;
		var tail = array.d;
		if (_Utils_eq(end, len)) {
			return array;
		} else {
			if (_Utils_cmp(
				end,
				$elm$core$Array$tailIndex(len)) > -1) {
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					startShift,
					tree,
					A3($elm$core$Elm$JsArray$slice, 0, $elm$core$Array$bitMask & end, tail));
			} else {
				var endIdx = $elm$core$Array$tailIndex(end);
				var depth = $elm$core$Basics$floor(
					A2(
						$elm$core$Basics$logBase,
						$elm$core$Array$branchFactor,
						A2($elm$core$Basics$max, 1, endIdx - 1)));
				var newShift = A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep);
				return A4(
					$elm$core$Array$Array_elm_builtin,
					end,
					newShift,
					A3(
						$elm$core$Array$hoistTree,
						startShift,
						newShift,
						A3($elm$core$Array$sliceTree, startShift, endIdx, tree)),
					A4($elm$core$Array$fetchNewTail, startShift, end, endIdx, tree));
			}
		}
	});
var $elm$core$Array$translateIndex = F2(
	function (index, _v0) {
		var len = _v0.a;
		var posIndex = (index < 0) ? (len + index) : index;
		return (posIndex < 0) ? 0 : ((_Utils_cmp(posIndex, len) > 0) ? len : posIndex);
	});
var $elm$core$Array$slice = F3(
	function (from, to, array) {
		var correctTo = A2($elm$core$Array$translateIndex, to, array);
		var correctFrom = A2($elm$core$Array$translateIndex, from, array);
		return (_Utils_cmp(correctFrom, correctTo) > 0) ? $elm$core$Array$empty : A2(
			$elm$core$Array$sliceLeft,
			correctFrom,
			A2($elm$core$Array$sliceRight, correctTo, array));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$dynamicBytes = function (_v0) {
	var mem = _v0.a;
	return A3($elm$core$Array$slice, 0, mem.staticBase, mem.bytes);
};
var $elm$bytes$Bytes$Encode$encode = _Bytes_encode;
var $elm$bytes$Bytes$Encode$Seq = F2(
	function (a, b) {
		return {$: 'Seq', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$getWidths = F2(
	function (width, builders) {
		getWidths:
		while (true) {
			if (!builders.b) {
				return width;
			} else {
				var b = builders.a;
				var bs = builders.b;
				var $temp$width = width + $elm$bytes$Bytes$Encode$getWidth(b),
					$temp$builders = bs;
				width = $temp$width;
				builders = $temp$builders;
				continue getWidths;
			}
		}
	});
var $elm$bytes$Bytes$Encode$sequence = function (builders) {
	return A2(
		$elm$bytes$Bytes$Encode$Seq,
		A2($elm$bytes$Bytes$Encode$getWidths, 0, builders),
		builders);
};
var $elm$bytes$Bytes$Encode$U32 = F2(
	function (a, b) {
		return {$: 'U32', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt32 = $elm$bytes$Bytes$Encode$U32;
var $techbelly$elm_zmachine$ZMachine$Snapshot$encodeLengthPrefixed = F2(
	function (itemEncoder, items) {
		return $elm$bytes$Bytes$Encode$sequence(
			A2(
				$elm$core$List$cons,
				A2(
					$elm$bytes$Bytes$Encode$unsignedInt32,
					$elm$bytes$Bytes$BE,
					$elm$core$List$length(items)),
				A2($elm$core$List$map, itemEncoder, items)));
	});
var $elm$bytes$Bytes$Encode$U8 = function (a) {
	return {$: 'U8', a: a};
};
var $elm$bytes$Bytes$Encode$unsignedInt8 = $elm$bytes$Bytes$Encode$U8;
var $techbelly$elm_zmachine$ZMachine$Snapshot$encodeStoreRef = function (ref) {
	var _v0 = function () {
		if (ref.$ === 'Nothing') {
			return _Utils_Tuple3(0, 0, 0);
		} else {
			switch (ref.a.$) {
				case 'Stack':
					var _v2 = ref.a;
					return _Utils_Tuple3(1, 0, 0);
				case 'Local':
					var n = ref.a.a;
					return _Utils_Tuple3(1, 1, n);
				default:
					var n = ref.a.a;
					return _Utils_Tuple3(1, 2, n);
			}
		}
	}();
	var flag = _v0.a;
	var kind = _v0.b;
	var num = _v0.c;
	return $elm$bytes$Bytes$Encode$sequence(
		_List_fromArray(
			[
				$elm$bytes$Bytes$Encode$unsignedInt8(flag),
				$elm$bytes$Bytes$Encode$unsignedInt8(kind),
				$elm$bytes$Bytes$Encode$unsignedInt8(num)
			]));
};
var $elm$bytes$Bytes$Encode$U16 = F2(
	function (a, b) {
		return {$: 'U16', a: a, b: b};
	});
var $elm$bytes$Bytes$Encode$unsignedInt16 = $elm$bytes$Bytes$Encode$U16;
var $techbelly$elm_zmachine$ZMachine$Snapshot$encodeWord = function (w) {
	return A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, w & 65535);
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$encodeFrame = function (frame) {
	return $elm$bytes$Bytes$Encode$sequence(
		_List_fromArray(
			[
				A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, frame.returnPC),
				$techbelly$elm_zmachine$ZMachine$Snapshot$encodeStoreRef(frame.returnStore),
				$elm$bytes$Bytes$Encode$unsignedInt8(
				$elm$core$Array$length(frame.locals)),
				$elm$bytes$Bytes$Encode$unsignedInt8(frame.argCount),
				$elm$bytes$Bytes$Encode$sequence(
				A2(
					$elm$core$List$map,
					$techbelly$elm_zmachine$ZMachine$Snapshot$encodeWord,
					$elm$core$Array$toList(frame.locals))),
				A2($techbelly$elm_zmachine$ZMachine$Snapshot$encodeLengthPrefixed, $techbelly$elm_zmachine$ZMachine$Snapshot$encodeWord, frame.evalStack)
			]));
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$encodeSerial = function (s) {
	var padded = A2($elm$core$String$left, 6, s + '      ');
	var codes = A2(
		$elm$core$List$map,
		$elm$core$Char$toCode,
		$elm$core$String$toList(padded));
	return $elm$bytes$Bytes$Encode$sequence(
		A2($elm$core$List$map, $elm$bytes$Bytes$Encode$unsignedInt8, codes));
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$nativeMagic = 1162631763;
var $techbelly$elm_zmachine$ZMachine$Snapshot$nativeVersion = 3;
var $techbelly$elm_zmachine$ZMachine$Snapshot$resumeKindToByte = function (kind) {
	switch (kind.$) {
		case 'ResumeAt':
			return 0;
		case 'ResumeByBranchTrue':
			return 1;
		default:
			return 2;
	}
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$encode = F2(
	function (originalMemory, _v0) {
		var snap = _v0.a;
		var compressedDynMem = $techbelly$elm_zmachine$Library$CMem$compress(
			{
				current: snap.dynamicMem,
				original: $techbelly$elm_zmachine$ZMachine$Memory$dynamicBytes(originalMemory)
			});
		return $elm$bytes$Bytes$Encode$encode(
			$elm$bytes$Bytes$Encode$sequence(
				_List_fromArray(
					[
						A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, $techbelly$elm_zmachine$ZMachine$Snapshot$nativeMagic),
						$elm$bytes$Bytes$Encode$unsignedInt8($techbelly$elm_zmachine$ZMachine$Snapshot$nativeVersion),
						$elm$bytes$Bytes$Encode$unsignedInt8(
						$techbelly$elm_zmachine$ZMachine$Snapshot$resumeKindToByte(snap.resume)),
						A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, snap.metaData.release),
						$techbelly$elm_zmachine$ZMachine$Snapshot$encodeSerial(snap.metaData.serial),
						A2($elm$bytes$Bytes$Encode$unsignedInt16, $elm$bytes$Bytes$BE, snap.metaData.checksum),
						A2($elm$bytes$Bytes$Encode$unsignedInt32, $elm$bytes$Bytes$BE, snap.pcAddr),
						A2($techbelly$elm_zmachine$ZMachine$Snapshot$encodeLengthPrefixed, $elm$bytes$Bytes$Encode$unsignedInt8, compressedDynMem),
						A2($techbelly$elm_zmachine$ZMachine$Snapshot$encodeLengthPrefixed, $techbelly$elm_zmachine$ZMachine$Snapshot$encodeWord, snap.evalStack),
						A2($techbelly$elm_zmachine$ZMachine$Snapshot$encodeLengthPrefixed, $techbelly$elm_zmachine$ZMachine$Snapshot$encodeFrame, snap.callFrames)
					])));
	});
var $techbelly$elm_zengine$ZEngine$okFromTriple = function (_v0) {
	var session = _v0.a;
	var events = _v0.b;
	var cmd = _v0.c;
	return A3($techbelly$elm_zengine$ZEngine$okStep, session, events, cmd);
};
var $techbelly$elm_zengine$ZEngine$StatusLineChanged = function (a) {
	return {$: 'StatusLineChanged', a: a};
};
var $techbelly$elm_zengine$ZEngine$Output$processEvent = F2(
	function (event, pending) {
		switch (event.$) {
			case 'PrintText':
				var s = event.a;
				return _Utils_update(
					pending,
					{
						text: _Utils_ap(pending.text, s)
					});
			case 'PrintObject':
				var s = event.a;
				return _Utils_update(
					pending,
					{
						text: _Utils_ap(pending.text, s)
					});
			case 'ShowStatusLine':
				var status = event.a;
				return _Utils_update(
					pending,
					{
						statusLine: $elm$core$Maybe$Just(status)
					});
			default:
				return pending;
		}
	});
var $techbelly$elm_zengine$ZEngine$Output$processEvents = F2(
	function (events, pending) {
		return A3($elm$core$List$foldl, $techbelly$elm_zengine$ZEngine$Output$processEvent, pending, events);
	});
var $techbelly$elm_zengine$ZEngine$InputFrame = function (a) {
	return {$: 'InputFrame', a: a};
};
var $techbelly$elm_zengine$ZEngine$OutputFrame = function (a) {
	return {$: 'OutputFrame', a: a};
};
var $techbelly$elm_zengine$ZEngine$ScoreAndTurns = F2(
	function (a, b) {
		return {$: 'ScoreAndTurns', a: a, b: b};
	});
var $techbelly$elm_zengine$ZEngine$ScreenRows = function (a) {
	return {$: 'ScreenRows', a: a};
};
var $techbelly$elm_zengine$ZEngine$TimeOfDay = F2(
	function (a, b) {
		return {$: 'TimeOfDay', a: a, b: b};
	});
var $techbelly$elm_zengine$ZEngine$toPublicStatusLineMode = function (mode) {
	switch (mode.$) {
		case 'ScoreAndTurns':
			var s = mode.a;
			var t = mode.b;
			return A2($techbelly$elm_zengine$ZEngine$ScoreAndTurns, s, t);
		case 'TimeOfDay':
			var h = mode.a;
			var m = mode.b;
			return A2($techbelly$elm_zengine$ZEngine$TimeOfDay, h, m);
		default:
			var rows = mode.a;
			return $techbelly$elm_zengine$ZEngine$ScreenRows(rows);
	}
};
var $techbelly$elm_zengine$ZEngine$toPublicStatusLine = function (sl) {
	return {
		locationId: sl.locationId,
		locationName: sl.locationName,
		mode: $techbelly$elm_zengine$ZEngine$toPublicStatusLineMode(sl.mode)
	};
};
var $techbelly$elm_zengine$ZEngine$toPublicFrame = function (frame) {
	if (frame.$ === 'OutputFrame') {
		var data = frame.a;
		return $techbelly$elm_zengine$ZEngine$OutputFrame(
			{
				statusLine: A2($elm$core$Maybe$map, $techbelly$elm_zengine$ZEngine$toPublicStatusLine, data.statusLine),
				text: data.text
			});
	} else {
		var data = frame.a;
		return $techbelly$elm_zengine$ZEngine$InputFrame(
			{command: data.command});
	}
};
var $techbelly$elm_zengine$ZEngine$onAutoRespondPrompt = F4(
	function (respond, events, machine, state) {
		var finalOutput = A2($techbelly$elm_zengine$ZEngine$Output$processEvents, events, state.pendingOutput);
		var hasOutput = (!$elm$core$String$isEmpty(finalOutput.text)) || (!_Utils_eq(finalOutput.statusLine, $elm$core$Maybe$Nothing));
		var newStatusLine = function () {
			var _v2 = finalOutput.statusLine;
			if (_v2.$ === 'Just') {
				var sl = _v2.a;
				return $elm$core$Maybe$Just(sl);
			} else {
				return state.currentStatusLine;
			}
		}();
		var statusChanged = !_Utils_eq(newStatusLine, state.currentStatusLine);
		var statusEvents = function () {
			var _v1 = _Utils_Tuple2(statusChanged, newStatusLine);
			if (_v1.a && (_v1.b.$ === 'Just')) {
				var sl = _v1.b.a;
				return _List_fromArray(
					[
						$techbelly$elm_zengine$ZEngine$StatusLineChanged(
						$techbelly$elm_zengine$ZEngine$toPublicStatusLine(sl))
					]);
			} else {
				return _List_Nil;
			}
		}();
		var outputEvents = hasOutput ? _List_fromArray(
			[
				$techbelly$elm_zengine$ZEngine$OutputProduced(
				$techbelly$elm_zengine$ZEngine$toPublicFrame(
					$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)))
			]) : _List_Nil;
		var transcriptAfterOutput = hasOutput ? _Utils_ap(
			state.transcript,
			_List_fromArray(
				[
					$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)
				])) : state.transcript;
		return _Utils_Tuple3(
			$techbelly$elm_zengine$ZEngine$Session(
				_Utils_update(
					state,
					{activePrompt: $elm$core$Maybe$Nothing, currentStatusLine: newStatusLine, machine: machine, pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput, phase: $techbelly$elm_zengine$ZEngine$Internal$Running, transcript: transcriptAfterOutput})),
			_Utils_ap(outputEvents, statusEvents),
			A2(
				$elm$core$Task$perform,
				function (_v0) {
					return $techbelly$elm_zengine$ZEngine$StepCompleted(
						respond(machine));
				},
				$elm$core$Task$succeed(_Utils_Tuple0)));
	});
var $techbelly$elm_zengine$ZEngine$Internal$LineActive = function (a) {
	return {$: 'LineActive', a: a};
};
var $techbelly$elm_zengine$ZEngine$LinePrompt = {$: 'LinePrompt'};
var $techbelly$elm_zengine$ZEngine$PromptIssued = function (a) {
	return {$: 'PromptIssued', a: a};
};
var $techbelly$elm_zengine$ZEngine$Internal$Waiting = {$: 'Waiting'};
var $techbelly$elm_zengine$ZEngine$TitleDetected = function (a) {
	return {$: 'TitleDetected', a: a};
};
var $techbelly$elm_zengine$ZEngine$TurnCompleted = {$: 'TurnCompleted'};
var $techbelly$elm_zengine$ZEngine$buildTurnEventsForLine = function (ctx) {
	var currentStatusLine = function () {
		var _v2 = ctx.finalFrame;
		if (_v2.$ === 'OutputFrame') {
			var data = _v2.a;
			var _v3 = data.statusLine;
			if (_v3.$ === 'Just') {
				var sl = _v3.a;
				return $elm$core$Maybe$Just(sl);
			} else {
				return ctx.previousStatusLine;
			}
		} else {
			return ctx.previousStatusLine;
		}
	}();
	var statusChanged = !_Utils_eq(currentStatusLine, ctx.previousStatusLine);
	return $elm$core$List$concat(
		_List_fromArray(
			[
				_List_fromArray(
				[
					$techbelly$elm_zengine$ZEngine$OutputProduced(ctx.finalFrame)
				]),
				function () {
				var _v0 = _Utils_Tuple2(statusChanged, currentStatusLine);
				if (_v0.a && (_v0.b.$ === 'Just')) {
					var sl = _v0.b.a;
					return _List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$StatusLineChanged(sl)
						]);
				} else {
					return _List_Nil;
				}
			}(),
				_List_fromArray(
				[$techbelly$elm_zengine$ZEngine$TurnCompleted]),
				function () {
				var _v1 = ctx.detectedTitle;
				if (_v1.$ === 'Just') {
					var title = _v1.a;
					return _List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$TitleDetected(title)
						]);
				} else {
					return _List_Nil;
				}
			}()
			]));
};
var $elm$core$Maybe$andThen = F2(
	function (callback, maybeValue) {
		if (maybeValue.$ === 'Just') {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeAt = {$: 'ResumeAt'};
var $techbelly$elm_zmachine$ZMachine$Snapshot$Snapshot = function (a) {
	return {$: 'Snapshot', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Header$checksum = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 28, mem);
};
var $techbelly$elm_zmachine$ZMachine$Header$releaseNumber = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, 2, mem);
};
var $techbelly$elm_zmachine$ZMachine$Memory$readSlice = F3(
	function (addr, count, mem) {
		return A2(
			$elm$core$List$map,
			function (i) {
				return A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr + i, mem);
			},
			A2($elm$core$List$range, 0, count - 1));
	});
var $techbelly$elm_zmachine$ZMachine$Header$serialNumber = function (mem) {
	return $elm$core$String$fromList(
		A2(
			$elm$core$List$map,
			$elm$core$Char$fromCode,
			A3($techbelly$elm_zmachine$ZMachine$Memory$readSlice, 18, 6, mem)));
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$capture = function (args) {
	return $techbelly$elm_zmachine$ZMachine$Snapshot$Snapshot(
		{
			callFrames: args.callStack,
			dynamicMem: $techbelly$elm_zmachine$ZMachine$Memory$dynamicBytes(args.memory),
			evalStack: args.stack,
			metaData: {
				checksum: $techbelly$elm_zmachine$ZMachine$Header$checksum(args.memory),
				release: $techbelly$elm_zmachine$ZMachine$Header$releaseNumber(args.memory),
				serial: $techbelly$elm_zmachine$ZMachine$Header$serialNumber(args.memory)
			},
			pcAddr: args.pc,
			resume: args.resumeKind
		});
};
var $techbelly$elm_zmachine$ZMachine$snapshot = function (machine) {
	return $techbelly$elm_zmachine$ZMachine$Snapshot$capture(
		{callStack: machine.callStack, memory: machine.memory, pc: machine.pc, resumeKind: $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeAt, stack: machine.stack});
};
var $techbelly$elm_zengine$ZEngine$Snapshot$encode = function (machine) {
	return A2(
		$techbelly$elm_zmachine$ZMachine$Snapshot$encode,
		machine.originalMemory,
		$techbelly$elm_zmachine$ZMachine$snapshot(machine));
};
var $techbelly$elm_zengine$ZEngine$Types$AtTime = F2(
	function (a, b) {
		return {$: 'AtTime', a: a, b: b};
	});
var $techbelly$elm_zengine$ZEngine$Types$AtTurn = function (a) {
	return {$: 'AtTurn', a: a};
};
var $techbelly$elm_zengine$ZEngine$Output$moveInfoFromMode = function (mode) {
	switch (mode.$) {
		case 'ScoreAndTurns':
			var turns = mode.b;
			return $techbelly$elm_zengine$ZEngine$Types$AtTurn(turns);
		case 'TimeOfDay':
			var h = mode.a;
			var m = mode.b;
			return A2($techbelly$elm_zengine$ZEngine$Types$AtTime, h, m);
		default:
			return $techbelly$elm_zengine$ZEngine$Types$AtTurn(0);
	}
};
var $techbelly$elm_zengine$ZEngine$Output$lastOf = function (list) {
	lastOf:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var x = list.a;
				return $elm$core$Maybe$Just(x);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue lastOf;
			}
		}
	}
};
var $techbelly$elm_zengine$ZEngine$Output$shouldCaptureLocation = F2(
	function (locationId, existingHistory) {
		var _v0 = $techbelly$elm_zengine$ZEngine$Output$lastOf(existingHistory);
		if (_v0.$ === 'Nothing') {
			return true;
		} else {
			var prev = _v0.a;
			return !_Utils_eq(prev.locationId, locationId);
		}
	});
var $techbelly$elm_zengine$ZEngine$Output$captureTurnRecord = F4(
	function (machine, statusLine, transcript, existingHistory) {
		return A2(
			$elm$core$Maybe$andThen,
			function (sl) {
				return A2($techbelly$elm_zengine$ZEngine$Output$shouldCaptureLocation, sl.locationId, existingHistory) ? $elm$core$Maybe$Just(
					{
						index: $elm$core$List$length(existingHistory),
						locationId: sl.locationId,
						locationName: sl.locationName,
						moveInfo: $techbelly$elm_zengine$ZEngine$Output$moveInfoFromMode(sl.mode),
						snapshotBytes: $techbelly$elm_zengine$ZEngine$Snapshot$encode(machine),
						transcriptLength: $elm$core$List$length(transcript)
					}) : $elm$core$Maybe$Nothing;
			},
			statusLine);
	});
var $elm$core$String$filter = _String_filter;
var $elm$core$String$toUpper = _String_toUpper;
var $techbelly$elm_zengine$ZEngine$Title$isAllCapsTitle = function (line) {
	var letters = A2($elm$core$String$filter, $elm$core$Char$isAlpha, line);
	return ($elm$core$String$length(letters) >= 3) && _Utils_eq(
		letters,
		$elm$core$String$toUpper(letters));
};
var $elm$core$String$lines = _String_lines;
var $techbelly$elm_zengine$ZEngine$Title$fromOutput = function (output) {
	var candidates = A2(
		$elm$core$List$filter,
		function (line) {
			return ($elm$core$String$length(line) > 2) && ($elm$core$String$length(line) < 80);
		},
		A2(
			$elm$core$List$map,
			$elm$core$String$trim,
			$elm$core$String$lines(output)));
	var _v0 = A2($elm$core$List$filter, $techbelly$elm_zengine$ZEngine$Title$isAllCapsTitle, candidates);
	if (_v0.b) {
		var firstAllCaps = _v0.a;
		return $elm$core$Maybe$Just(firstAllCaps);
	} else {
		return $elm$core$List$head(candidates);
	}
};
var $techbelly$elm_zengine$ZEngine$onLinePrompt = F4(
	function (req, events, machine, state) {
		if (state.restoringSession) {
			return _Utils_Tuple3(
				$techbelly$elm_zengine$ZEngine$Session(
					_Utils_update(
						state,
						{
							activePrompt: $elm$core$Maybe$Just(
								$techbelly$elm_zengine$ZEngine$Internal$LineActive(req)),
							machine: machine,
							pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput,
							phase: $techbelly$elm_zengine$ZEngine$Internal$Waiting,
							restoringSession: false
						})),
				_List_fromArray(
					[
						$techbelly$elm_zengine$ZEngine$PromptIssued($techbelly$elm_zengine$ZEngine$LinePrompt)
					]),
				$elm$core$Platform$Cmd$none);
		} else {
			var finalOutput = A2($techbelly$elm_zengine$ZEngine$Output$processEvents, events, state.pendingOutput);
			var newStatusLine = function () {
				var _v3 = finalOutput.statusLine;
				if (_v3.$ === 'Just') {
					var sl = _v3.a;
					return $elm$core$Maybe$Just(sl);
				} else {
					return state.currentStatusLine;
				}
			}();
			var transcriptAfterOutput = _Utils_ap(
				state.transcript,
				_List_fromArray(
					[
						$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)
					]));
			var turnRecord = A4($techbelly$elm_zengine$ZEngine$Output$captureTurnRecord, machine, newStatusLine, transcriptAfterOutput, state.turnHistory);
			var newTurnHistory = function () {
				if (turnRecord.$ === 'Just') {
					var record = turnRecord.a;
					return _Utils_ap(
						state.turnHistory,
						_List_fromArray(
							[record]));
				} else {
					return state.turnHistory;
				}
			}();
			var detectedTitle = state.titleEmitted ? $elm$core$Maybe$Nothing : $techbelly$elm_zengine$ZEngine$Title$fromOutput(finalOutput.text);
			var nextStoryName = A2($elm$core$Maybe$withDefault, state.storyName, detectedTitle);
			var ctx = {
				detectedTitle: detectedTitle,
				finalFrame: $techbelly$elm_zengine$ZEngine$toPublicFrame(
					$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)),
				previousStatusLine: A2($elm$core$Maybe$map, $techbelly$elm_zengine$ZEngine$toPublicStatusLine, state.currentStatusLine)
			};
			var commonUpdates = function (s) {
				return _Utils_update(
					s,
					{
						currentStatusLine: newStatusLine,
						machine: machine,
						pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput,
						storyName: nextStoryName,
						titleEmitted: state.titleEmitted || (!_Utils_eq(detectedTitle, $elm$core$Maybe$Nothing)),
						turnHistory: newTurnHistory
					});
			};
			var _v0 = state.inputQueue;
			if (!_v0.b) {
				return _Utils_Tuple3(
					$techbelly$elm_zengine$ZEngine$Session(
						commonUpdates(
							_Utils_update(
								state,
								{
									activePrompt: $elm$core$Maybe$Just(
										$techbelly$elm_zengine$ZEngine$Internal$LineActive(req)),
									phase: $techbelly$elm_zengine$ZEngine$Internal$Waiting,
									transcript: transcriptAfterOutput
								}))),
					_Utils_ap(
						$techbelly$elm_zengine$ZEngine$buildTurnEventsForLine(ctx),
						_List_fromArray(
							[
								$techbelly$elm_zengine$ZEngine$PromptIssued($techbelly$elm_zengine$ZEngine$LinePrompt)
							])),
					$elm$core$Platform$Cmd$none);
			} else {
				var next = _v0.a;
				var rest = _v0.b;
				return _Utils_Tuple3(
					$techbelly$elm_zengine$ZEngine$Session(
						commonUpdates(
							_Utils_update(
								state,
								{
									activePrompt: $elm$core$Maybe$Nothing,
									inputQueue: rest,
									phase: $techbelly$elm_zengine$ZEngine$Internal$Running,
									transcript: _Utils_ap(
										transcriptAfterOutput,
										_List_fromArray(
											[
												$techbelly$elm_zengine$ZEngine$Types$InputFrame(
												{command: next})
											]))
								}))),
					$techbelly$elm_zengine$ZEngine$buildTurnEventsForLine(ctx),
					A2(
						$elm$core$Task$perform,
						function (_v1) {
							return $techbelly$elm_zengine$ZEngine$StepCompleted(
								A3(
									$techbelly$elm_zmachine$ZMachine$provideInput,
									A2($techbelly$elm_zengine$ZEngine$truncateInput, req, next),
									req,
									machine));
						},
						$elm$core$Task$succeed(_Utils_Tuple0)));
			}
		}
	});
var $techbelly$elm_zengine$ZEngine$onNonLinePrompt = F5(
	function (internalPrompt, publicPrompt, events, machine, state) {
		var finalOutput = A2($techbelly$elm_zengine$ZEngine$Output$processEvents, events, state.pendingOutput);
		var hasOutput = (!$elm$core$String$isEmpty(finalOutput.text)) || (!_Utils_eq(finalOutput.statusLine, $elm$core$Maybe$Nothing));
		var newStatusLine = function () {
			var _v1 = finalOutput.statusLine;
			if (_v1.$ === 'Just') {
				var sl = _v1.a;
				return $elm$core$Maybe$Just(sl);
			} else {
				return state.currentStatusLine;
			}
		}();
		var statusChanged = !_Utils_eq(newStatusLine, state.currentStatusLine);
		var statusEvents = function () {
			var _v0 = _Utils_Tuple2(statusChanged, newStatusLine);
			if (_v0.a && (_v0.b.$ === 'Just')) {
				var sl = _v0.b.a;
				return _List_fromArray(
					[
						$techbelly$elm_zengine$ZEngine$StatusLineChanged(
						$techbelly$elm_zengine$ZEngine$toPublicStatusLine(sl))
					]);
			} else {
				return _List_Nil;
			}
		}();
		var outputEvents = hasOutput ? _List_fromArray(
			[
				$techbelly$elm_zengine$ZEngine$OutputProduced(
				$techbelly$elm_zengine$ZEngine$toPublicFrame(
					$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)))
			]) : _List_Nil;
		var transcriptAfterOutput = hasOutput ? _Utils_ap(
			state.transcript,
			_List_fromArray(
				[
					$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)
				])) : state.transcript;
		return _Utils_Tuple3(
			$techbelly$elm_zengine$ZEngine$Session(
				_Utils_update(
					state,
					{
						activePrompt: $elm$core$Maybe$Just(internalPrompt),
						currentStatusLine: newStatusLine,
						machine: machine,
						pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput,
						phase: $techbelly$elm_zengine$ZEngine$Internal$Waiting,
						transcript: transcriptAfterOutput
					})),
			_Utils_ap(
				outputEvents,
				_Utils_ap(
					statusEvents,
					_List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$PromptIssued(publicPrompt)
						]))),
			$elm$core$Platform$Cmd$none);
	});
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $techbelly$elm_zmachine$ZMachine$Run$provideChar = F2(
	function (input, machine) {
		var instr = A2($techbelly$elm_zmachine$ZMachine$Decode$decode, machine.pc, machine.memory);
		var nextPC = machine.pc + instr.length;
		var charCode = A2(
			$elm$core$Maybe$withDefault,
			13,
			A2(
				$elm$core$Maybe$map,
				A2($elm$core$Basics$composeR, $elm$core$Tuple$first, $elm$core$Char$toCode),
				$elm$core$String$uncons(input)));
		return $techbelly$elm_zmachine$ZMachine$Run$drain(
			A3(
				$techbelly$elm_zmachine$ZMachine$Execute$storeInstr,
				instr,
				charCode,
				_Utils_update(
					machine,
					{pc: nextPC})));
	});
var $techbelly$elm_zmachine$ZMachine$provideChar = $techbelly$elm_zmachine$ZMachine$Run$provideChar;
var $techbelly$elm_zmachine$ZMachine$Snapshot$SnapshotCorrupt = function (a) {
	return {$: 'SnapshotCorrupt', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$WrongStory = function (a) {
	return {$: 'WrongStory', a: a};
};
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (result.$ === 'Ok') {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $elm$core$Array$appendHelpTree = F2(
	function (toAppend, array) {
		var len = array.a;
		var tree = array.c;
		var tail = array.d;
		var itemsToAppend = $elm$core$Elm$JsArray$length(toAppend);
		var notAppended = ($elm$core$Array$branchFactor - $elm$core$Elm$JsArray$length(tail)) - itemsToAppend;
		var appended = A3($elm$core$Elm$JsArray$appendN, $elm$core$Array$branchFactor, tail, toAppend);
		var newArray = A2($elm$core$Array$unsafeReplaceTail, appended, array);
		if (notAppended < 0) {
			var nextTail = A3($elm$core$Elm$JsArray$slice, notAppended, itemsToAppend, toAppend);
			return A2($elm$core$Array$unsafeReplaceTail, nextTail, newArray);
		} else {
			return newArray;
		}
	});
var $elm$core$Elm$JsArray$foldl = _JsArray_foldl;
var $elm$core$Array$builderFromArray = function (_v0) {
	var len = _v0.a;
	var tree = _v0.c;
	var tail = _v0.d;
	var helper = F2(
		function (node, acc) {
			if (node.$ === 'SubTree') {
				var subTree = node.a;
				return A3($elm$core$Elm$JsArray$foldl, helper, acc, subTree);
			} else {
				return A2($elm$core$List$cons, node, acc);
			}
		});
	return {
		nodeList: A3($elm$core$Elm$JsArray$foldl, helper, _List_Nil, tree),
		nodeListSize: (len / $elm$core$Array$branchFactor) | 0,
		tail: tail
	};
};
var $elm$core$Array$append = F2(
	function (a, _v0) {
		var aTail = a.d;
		var bLen = _v0.a;
		var bTree = _v0.c;
		var bTail = _v0.d;
		if (_Utils_cmp(bLen, $elm$core$Array$branchFactor * 4) < 1) {
			var foldHelper = F2(
				function (node, array) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, array, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpTree, leaf, array);
					}
				});
			return A2(
				$elm$core$Array$appendHelpTree,
				bTail,
				A3($elm$core$Elm$JsArray$foldl, foldHelper, a, bTree));
		} else {
			var foldHelper = F2(
				function (node, builder) {
					if (node.$ === 'SubTree') {
						var tree = node.a;
						return A3($elm$core$Elm$JsArray$foldl, foldHelper, builder, tree);
					} else {
						var leaf = node.a;
						return A2($elm$core$Array$appendHelpBuilder, leaf, builder);
					}
				});
			return A2(
				$elm$core$Array$builderToArray,
				true,
				A2(
					$elm$core$Array$appendHelpBuilder,
					bTail,
					A3(
						$elm$core$Elm$JsArray$foldl,
						foldHelper,
						$elm$core$Array$builderFromArray(a),
						bTree)));
		}
	});
var $techbelly$elm_zmachine$Library$ArrayExtra$merge = F2(
	function (source, target) {
		var targetLen = $elm$core$Array$length(target);
		var sourceLen = $elm$core$Array$length(source);
		return (_Utils_cmp(sourceLen, targetLen) > -1) ? A3($elm$core$Array$slice, 0, targetLen, source) : A2(
			$elm$core$Array$append,
			source,
			A3($elm$core$Array$slice, sourceLen, targetLen, target));
	});
var $techbelly$elm_zmachine$ZMachine$Memory$replaceDynamic = F2(
	function (newDynamic, _v0) {
		var mem = _v0.a;
		var expected = mem.staticBase;
		var actual = $elm$core$Array$length(newDynamic);
		return (!_Utils_eq(actual, expected)) ? $elm$core$Result$Err(
			'replaceDynamic: expected ' + ($elm$core$String$fromInt(expected) + (' bytes, got ' + $elm$core$String$fromInt(actual)))) : $elm$core$Result$Ok(
			$techbelly$elm_zmachine$ZMachine$Memory$Memory(
				_Utils_update(
					mem,
					{
						bytes: A2($techbelly$elm_zmachine$Library$ArrayExtra$merge, newDynamic, mem.bytes)
					})));
	});
var $techbelly$elm_zmachine$ZMachine$Snapshot$restore = F2(
	function (_v0, originalMemory) {
		var snap = _v0.a;
		var currentMeta = {
			checksum: $techbelly$elm_zmachine$ZMachine$Header$checksum(originalMemory),
			release: $techbelly$elm_zmachine$ZMachine$Header$releaseNumber(originalMemory),
			serial: $techbelly$elm_zmachine$ZMachine$Header$serialNumber(originalMemory)
		};
		return (!_Utils_eq(snap.metaData, currentMeta)) ? $elm$core$Result$Err(
			$techbelly$elm_zmachine$ZMachine$Snapshot$WrongStory(
				{expected: currentMeta, found: snap.metaData})) : A2(
			$elm$core$Result$map,
			function (rebuiltMemory) {
				return {callStack: snap.callFrames, memory: rebuiltMemory, pc: snap.pcAddr, stack: snap.evalStack};
			},
			A2(
				$elm$core$Result$mapError,
				$techbelly$elm_zmachine$ZMachine$Snapshot$SnapshotCorrupt,
				A2($techbelly$elm_zmachine$ZMachine$Memory$replaceDynamic, snap.dynamicMem, originalMemory)));
	});
var $techbelly$elm_zmachine$ZMachine$Snapshot$resumeKind = function (_v0) {
	var snap = _v0.a;
	return snap.resume;
};
var $techbelly$elm_zmachine$ZMachine$Execute$Halted = function (a) {
	return {$: 'Halted', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Execute$executeReturn = F2(
	function (value, machine) {
		var _v0 = machine.callStack;
		if (_v0.b) {
			var frame = _v0.a;
			var rest = _v0.b;
			var m = _Utils_update(
				machine,
				{callStack: rest, pc: frame.returnPC, stack: frame.evalStack});
			var _v1 = frame.returnStore;
			if (_v1.$ === 'Just') {
				var varRef = _v1.a;
				return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
					A3($techbelly$elm_zmachine$ZMachine$State$writeVariable, varRef, value, m));
			} else {
				return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m);
			}
		} else {
			return $techbelly$elm_zmachine$ZMachine$Execute$Halted(machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeBranch = F3(
	function (instr, conditionResult, machine) {
		var _v0 = instr.branch;
		if (_v0.$ === 'Just') {
			var branch = _v0.a;
			if (_Utils_eq(branch.condition, conditionResult)) {
				var _v1 = branch.target;
				switch (_v1.$) {
					case 'ReturnFalse':
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, 0, machine);
					case 'ReturnTrue':
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, 1, machine);
					default:
						var offset = _v1.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							_Utils_update(
								machine,
								{pc: (machine.pc + offset) - 2}));
				}
			} else {
				return $techbelly$elm_zmachine$ZMachine$Execute$Continue(machine);
			}
		} else {
			return $techbelly$elm_zmachine$ZMachine$Execute$Continue(machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$resumeWithBranch = F2(
	function (success, machine) {
		var instr = A2($techbelly$elm_zmachine$ZMachine$Decode$decode, machine.pc, machine.memory);
		var nextPC = machine.pc + instr.length;
		var m = _Utils_update(
			machine,
			{pc: nextPC});
		return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, success, m);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$resumeWithStore = F2(
	function (value, machine) {
		var instr = A2($techbelly$elm_zmachine$ZMachine$Decode$decode, machine.pc, machine.memory);
		var nextPC = machine.pc + instr.length;
		var m = _Utils_update(
			machine,
			{pc: nextPC});
		return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, value, m);
	});
var $techbelly$elm_zmachine$ZMachine$Run$provideRestoreResult = F2(
	function (maybeSnap, machine) {
		if (maybeSnap.$ === 'Nothing') {
			return $techbelly$elm_zmachine$ZMachine$Run$drain(
				A2($techbelly$elm_zmachine$ZMachine$Execute$resumeWithBranch, false, machine));
		} else {
			var snap = maybeSnap.a;
			var _v1 = A2($techbelly$elm_zmachine$ZMachine$Snapshot$restore, snap, machine.originalMemory);
			if (_v1.$ === 'Err') {
				return $techbelly$elm_zmachine$ZMachine$Run$drain(
					A2($techbelly$elm_zmachine$ZMachine$Execute$resumeWithBranch, false, machine));
			} else {
				var parts = _v1.a;
				var restored = _Utils_update(
					machine,
					{callStack: parts.callStack, memory: parts.memory, pc: parts.pc, stack: parts.stack});
				var _v2 = $techbelly$elm_zmachine$ZMachine$Snapshot$resumeKind(snap);
				switch (_v2.$) {
					case 'ResumeAt':
						return A2($techbelly$elm_zmachine$ZMachine$Types$Continue, _List_Nil, restored);
					case 'ResumeByBranchTrue':
						return $techbelly$elm_zmachine$ZMachine$Run$drain(
							A2($techbelly$elm_zmachine$ZMachine$Execute$resumeWithBranch, true, restored));
					default:
						return $techbelly$elm_zmachine$ZMachine$Run$drain(
							A2($techbelly$elm_zmachine$ZMachine$Execute$resumeWithStore, 2, restored));
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$provideRestoreResult = $techbelly$elm_zmachine$ZMachine$Run$provideRestoreResult;
var $techbelly$elm_zmachine$ZMachine$Run$provideSaveResult = F2(
	function (success, machine) {
		var version = $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory).version;
		if (version.$ === 'V5') {
			return $techbelly$elm_zmachine$ZMachine$Run$drain(
				A2(
					$techbelly$elm_zmachine$ZMachine$Execute$resumeWithStore,
					success ? 1 : 0,
					machine));
		} else {
			return $techbelly$elm_zmachine$ZMachine$Run$drain(
				A2($techbelly$elm_zmachine$ZMachine$Execute$resumeWithBranch, success, machine));
		}
	});
var $techbelly$elm_zmachine$ZMachine$provideSaveResult = $techbelly$elm_zmachine$ZMachine$Run$provideSaveResult;
var $techbelly$elm_zengine$ZEngine$RuntimeError = function (a) {
	return {$: 'RuntimeError', a: a};
};
var $techbelly$elm_zengine$ZEngine$runtimeErrored = F3(
	function (session, events, message) {
		return {
			cmd: $elm$core$Platform$Cmd$none,
			error: $elm$core$Maybe$Just(
				$techbelly$elm_zengine$ZEngine$RuntimeError(message)),
			events: events,
			session: $elm$core$Maybe$Just(session)
		};
	});
var $techbelly$elm_zengine$ZEngine$zmachineErrorToString = function (err) {
	switch (err.$) {
		case 'DivisionByZero':
			return 'Division by zero';
		case 'StackUnderflow':
			return 'Stack underflow';
		case 'InvalidOpcode':
			var n = err.a;
			return 'Invalid opcode: ' + $elm$core$String$fromInt(n);
		default:
			var n = err.a;
			return 'Invalid variable: ' + $elm$core$String$fromInt(n);
	}
};
var $techbelly$elm_zengine$ZEngine$dispatch = F2(
	function (result, state) {
		switch (result.$) {
			case 'Continue':
				var events = result.a;
				var machine = result.b;
				return A3(
					$techbelly$elm_zengine$ZEngine$okStep,
					$techbelly$elm_zengine$ZEngine$Session(
						_Utils_update(
							state,
							{
								machine: machine,
								pendingOutput: A2($techbelly$elm_zengine$ZEngine$Output$processEvents, events, state.pendingOutput),
								phase: $techbelly$elm_zengine$ZEngine$Internal$Running
							})),
					_List_Nil,
					$techbelly$elm_zengine$ZEngine$yieldCmd);
			case 'NeedInput':
				var req = result.a;
				var events = result.b;
				var machine = result.c;
				return $techbelly$elm_zengine$ZEngine$okFromTriple(
					A4($techbelly$elm_zengine$ZEngine$onLinePrompt, req, events, machine, state));
			case 'NeedChar':
				var events = result.a;
				var machine = result.b;
				var _v1 = state.config.onCharPrompt;
				if (_v1.$ === 'SurfaceChar') {
					return $techbelly$elm_zengine$ZEngine$okFromTriple(
						A5($techbelly$elm_zengine$ZEngine$onNonLinePrompt, $techbelly$elm_zengine$ZEngine$Internal$CharActive, $techbelly$elm_zengine$ZEngine$CharPrompt, events, machine, state));
				} else {
					var c = _v1.a;
					return $techbelly$elm_zengine$ZEngine$okFromTriple(
						A4(
							$techbelly$elm_zengine$ZEngine$onAutoRespondPrompt,
							$techbelly$elm_zmachine$ZMachine$provideChar(
								$elm$core$String$fromChar(c)),
							events,
							machine,
							state));
				}
			case 'NeedSave':
				var machineSnapshot = result.a;
				var events = result.b;
				var machine = result.c;
				var _v2 = state.config.onSavePrompt;
				if (_v2.$ === 'SurfaceSave') {
					var saveBytes = A2($techbelly$elm_zmachine$ZMachine$Snapshot$encode, state.machine.originalMemory, machineSnapshot);
					return $techbelly$elm_zengine$ZEngine$okFromTriple(
						A5(
							$techbelly$elm_zengine$ZEngine$onNonLinePrompt,
							$techbelly$elm_zengine$ZEngine$Internal$SaveActive(saveBytes),
							$techbelly$elm_zengine$ZEngine$SavePrompt(saveBytes),
							events,
							machine,
							state));
				} else {
					return $techbelly$elm_zengine$ZEngine$okFromTriple(
						A4(
							$techbelly$elm_zengine$ZEngine$onAutoRespondPrompt,
							$techbelly$elm_zmachine$ZMachine$provideSaveResult(false),
							events,
							machine,
							state));
				}
			case 'NeedRestore':
				var events = result.a;
				var machine = result.b;
				var _v3 = state.config.onRestorePrompt;
				if (_v3.$ === 'SurfaceRestore') {
					return $techbelly$elm_zengine$ZEngine$okFromTriple(
						A5($techbelly$elm_zengine$ZEngine$onNonLinePrompt, $techbelly$elm_zengine$ZEngine$Internal$RestoreActive, $techbelly$elm_zengine$ZEngine$RestorePrompt, events, machine, state));
				} else {
					return $techbelly$elm_zengine$ZEngine$okFromTriple(
						A4(
							$techbelly$elm_zengine$ZEngine$onAutoRespondPrompt,
							$techbelly$elm_zmachine$ZMachine$provideRestoreResult($elm$core$Maybe$Nothing),
							events,
							machine,
							state));
				}
			case 'Halted':
				var events = result.a;
				var machine = result.b;
				var finalOutput = A2($techbelly$elm_zengine$ZEngine$Output$processEvents, events, state.pendingOutput);
				var newTranscript = _Utils_ap(
					state.transcript,
					_List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)
						]));
				return A3(
					$techbelly$elm_zengine$ZEngine$okStep,
					$techbelly$elm_zengine$ZEngine$Session(
						_Utils_update(
							state,
							{machine: machine, pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput, phase: $techbelly$elm_zengine$ZEngine$Internal$Halted, transcript: newTranscript})),
					_List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$OutputProduced(
							$techbelly$elm_zengine$ZEngine$toPublicFrame(
								$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput))),
							$techbelly$elm_zengine$ZEngine$GameOver
						]),
					$elm$core$Platform$Cmd$none);
			default:
				var err = result.a;
				var events = result.b;
				var machine = result.c;
				var message = $techbelly$elm_zengine$ZEngine$zmachineErrorToString(err);
				var finalOutput = A2($techbelly$elm_zengine$ZEngine$Output$processEvents, events, state.pendingOutput);
				var newTranscript = _Utils_ap(
					state.transcript,
					_List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)
						]));
				var erroredSession = $techbelly$elm_zengine$ZEngine$Session(
					_Utils_update(
						state,
						{
							machine: machine,
							pendingOutput: $techbelly$elm_zengine$ZEngine$Types$emptyPendingOutput,
							phase: $techbelly$elm_zengine$ZEngine$Internal$Errored(message),
							transcript: newTranscript
						}));
				return A3(
					$techbelly$elm_zengine$ZEngine$runtimeErrored,
					erroredSession,
					_List_fromArray(
						[
							$techbelly$elm_zengine$ZEngine$OutputProduced(
							$techbelly$elm_zengine$ZEngine$toPublicFrame(
								$techbelly$elm_zengine$ZEngine$Types$OutputFrame(finalOutput)))
						]),
					message);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Types$DivisionByZero = {$: 'DivisionByZero'};
var $techbelly$elm_zmachine$ZMachine$Execute$Error = F2(
	function (a, b) {
		return {$: 'Error', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Types$InvalidOpcode = function (a) {
	return {$: 'InvalidOpcode', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Execute$NeedChar = function (a) {
	return {$: 'NeedChar', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Execute$NeedRestore = function (a) {
	return {$: 'NeedRestore', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Execute$NeedSave = F2(
	function (a, b) {
		return {$: 'NeedSave', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Types$PlaySound = function (a) {
	return {$: 'PlaySound', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeByBranchTrue = {$: 'ResumeByBranchTrue'};
var $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeByStoreResult = {$: 'ResumeByStoreResult'};
var $techbelly$elm_zmachine$ZMachine$Types$SetBufferMode = function (a) {
	return {$: 'SetBufferMode', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Types$SetColour = F2(
	function (a, b) {
		return {$: 'SetColour', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Types$SetTextStyle = function (a) {
	return {$: 'SetTextStyle', a: a};
};
var $techbelly$elm_zmachine$ZMachine$Types$Upper = {$: 'Upper'};
var $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16 = function (n) {
	return (n > 32767) ? (n - 65536) : n;
};
var $techbelly$elm_zmachine$Library$IntExtra$withSigned16 = F3(
	function (op, a, b) {
		return $techbelly$elm_zmachine$Library$IntExtra$toUnsignedInt16(
			A2(
				op,
				$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(a),
				$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(b)));
	});
var $techbelly$elm_zmachine$Library$IntExtra$addInt16 = $techbelly$elm_zmachine$Library$IntExtra$withSigned16($elm$core$Basics$add);
var $techbelly$elm_zmachine$ZMachine$ObjectTable$child = F2(
	function (objNum, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$readRelation,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).childOffset,
			objNum,
			mem);
	});
var $elm$core$Bitwise$complement = _Bitwise_complement;
var $elm$core$Basics$modBy = _Basics_modBy;
var $techbelly$elm_zmachine$ZMachine$ObjectTable$attributeLocation = F3(
	function (objNum, attr, mem) {
		return _Utils_Tuple2(
			A2($techbelly$elm_zmachine$ZMachine$ObjectTable$address, objNum, mem) + ((attr / 8) | 0),
			1 << (7 - A2($elm$core$Basics$modBy, 8, attr)));
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$updateAttribute = F4(
	function (combine, objNum, attr, mem) {
		if (!objNum) {
			return mem;
		} else {
			var _v0 = A3($techbelly$elm_zmachine$ZMachine$ObjectTable$attributeLocation, objNum, attr, mem);
			var addr = _v0.a;
			var mask = _v0.b;
			var _byte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem);
			return A3(
				$techbelly$elm_zmachine$ZMachine$Memory$writeByte,
				addr,
				A2(combine, _byte, mask),
				mem);
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$clearAttribute = $techbelly$elm_zmachine$ZMachine$ObjectTable$updateAttribute(
	F2(
		function (_byte, mask) {
			return _byte & (~mask);
		}));
var $techbelly$elm_zmachine$ZMachine$Text$decodeZStringWords = F2(
	function (words, mem) {
		var abbrTableAddr = $techbelly$elm_zmachine$ZMachine$Header$abbreviationsTableAddress(mem);
		var chars = A4($techbelly$elm_zmachine$ZMachine$Text$decodeWords, words, abbrTableAddr, mem, false);
		return $elm$core$String$fromList(chars);
	});
var $techbelly$elm_zmachine$Library$IntExtra$truncDiv = F2(
	function (a, b) {
		var result = a / b;
		return (result < 0) ? $elm$core$Basics$ceiling(result) : $elm$core$Basics$floor(result);
	});
var $techbelly$elm_zmachine$Library$IntExtra$divInt16 = $techbelly$elm_zmachine$Library$IntExtra$withSigned16($techbelly$elm_zmachine$Library$IntExtra$truncDiv);
var $elm$core$Dict$Black = {$: 'Black'};
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: 'RBNode_elm_builtin', a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = {$: 'Red'};
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Red')) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_elm_builtin')) && (left.d.a.$ === 'Red')) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Red,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1.$) {
				case 'LT':
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 'EQ':
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Array$repeat = F2(
	function (n, e) {
		return A2(
			$elm$core$Array$initialize,
			n,
			function (_v0) {
				return e;
			});
	});
var $techbelly$elm_zmachine$ZMachine$Window$eraseLine = F2(
	function (value, uw) {
		if (value === 1) {
			var row = A2(
				$elm$core$Maybe$withDefault,
				A2(
					$elm$core$Array$repeat,
					uw.width,
					_Utils_chr(' ')),
				A2($elm$core$Dict$get, uw.cursorRow, uw.rows));
			var cleared = A3(
				$elm$core$List$foldl,
				F2(
					function (col, arr) {
						return A3(
							$elm$core$Array$set,
							col,
							_Utils_chr(' '),
							arr);
					}),
				row,
				A2($elm$core$List$range, uw.cursorCol - 1, uw.width - 1));
			return _Utils_update(
				uw,
				{
					rows: A3($elm$core$Dict$insert, uw.cursorRow, cleared, uw.rows)
				});
		} else {
			return uw;
		}
	});
var $techbelly$elm_zmachine$ZMachine$State$eraseLine = F2(
	function (value, machine) {
		return _Utils_update(
			machine,
			{
				upperWindow: A2($techbelly$elm_zmachine$ZMachine$Window$eraseLine, value, machine.upperWindow)
			});
	});
var $techbelly$elm_zmachine$ZMachine$Window$eraseWindow = F2(
	function (win, uw) {
		if ((win === 1) || (_Utils_eq(win, -1) || _Utils_eq(win, -2))) {
			var cleared = _Utils_update(
				uw,
				{cursorCol: 1, cursorRow: 1, firstPrintedObj: 0, rows: $elm$core$Dict$empty});
			return _Utils_eq(win, -1) ? _Utils_update(
				cleared,
				{height: 0}) : cleared;
		} else {
			return uw;
		}
	});
var $techbelly$elm_zmachine$ZMachine$State$eraseWindow = F2(
	function (win, machine) {
		return _Utils_update(
			machine,
			{
				upperWindow: A2($techbelly$elm_zmachine$ZMachine$Window$eraseWindow, win, machine.upperWindow)
			});
	});
var $techbelly$elm_zmachine$ZMachine$Execute$operandAt = F2(
	function (index, ops) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($techbelly$elm_zmachine$Library$ListExtra$getAt, index, ops));
	});
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $techbelly$elm_zmachine$ZMachine$Execute$executeArtShift = F3(
	function (instr, ops, machine) {
		var places = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops));
		var number = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops));
		var result = (places >= 0) ? ((number << places) & 65535) : ((number >> $elm$core$Basics$abs(places)) & 65535);
		return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, result, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeAttrUpdate = F3(
	function (update, ops, machine) {
		return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{
					memory: A3(
						update,
						A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
						A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops),
						machine.memory)
				}));
	});
var $elm$core$Array$fromListHelp = F3(
	function (list, nodeList, nodeListSize) {
		fromListHelp:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, list);
			var jsArray = _v0.a;
			var remainingItems = _v0.b;
			if (_Utils_cmp(
				$elm$core$Elm$JsArray$length(jsArray),
				$elm$core$Array$branchFactor) < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					true,
					{nodeList: nodeList, nodeListSize: nodeListSize, tail: jsArray});
			} else {
				var $temp$list = remainingItems,
					$temp$nodeList = A2(
					$elm$core$List$cons,
					$elm$core$Array$Leaf(jsArray),
					nodeList),
					$temp$nodeListSize = nodeListSize + 1;
				list = $temp$list;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue fromListHelp;
			}
		}
	});
var $elm$core$Array$fromList = function (list) {
	if (!list.b) {
		return $elm$core$Array$empty;
	} else {
		return A3($elm$core$Array$fromListHelp, list, _List_Nil, 0);
	}
};
var $techbelly$elm_zmachine$ZMachine$Execute$mergeArgsWithDefaults = F2(
	function (args, defaults) {
		var _v0 = _Utils_Tuple2(args, defaults);
		if (!_v0.b.b) {
			return _List_Nil;
		} else {
			if (!_v0.a.b) {
				return defaults;
			} else {
				var _v1 = _v0.a;
				var arg = _v1.a;
				var restArgs = _v1.b;
				var _v2 = _v0.b;
				var restDefaults = _v2.b;
				return A2(
					$elm$core$List$cons,
					arg,
					A2($techbelly$elm_zmachine$ZMachine$Execute$mergeArgsWithDefaults, restArgs, restDefaults));
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Memory$unpackAddress = F2(
	function (packed, _v0) {
		var mem = _v0.a;
		return packed << mem.versionProfile.packingShift;
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeCall = F4(
	function (instr, packedAddr, args, machine) {
		if (!packedAddr) {
			return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, 0, machine);
		} else {
			var routineAddr = A2($techbelly$elm_zmachine$ZMachine$Memory$unpackAddress, packedAddr, machine.memory);
			var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory);
			var numLocals = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, routineAddr, machine.memory);
			var initialValues = p.routineHasInitialValues ? A2(
				$elm$core$List$map,
				function (i) {
					return A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, (routineAddr + 1) + ((i - 1) * $techbelly$elm_zmachine$ZMachine$Memory$wordLength), machine.memory);
				},
				A2($elm$core$List$range, 1, numLocals)) : A2($elm$core$List$repeat, numLocals, 0);
			var localsWithArgs = A2($techbelly$elm_zmachine$ZMachine$Execute$mergeArgsWithDefaults, args, initialValues);
			var frame = {
				argCount: $elm$core$List$length(args),
				evalStack: machine.stack,
				locals: $elm$core$Array$fromList(localsWithArgs),
				returnPC: machine.pc,
				returnStore: instr.store
			};
			var firstInstrAddr = p.routineHasInitialValues ? ((routineAddr + 1) + (numLocals * $techbelly$elm_zmachine$ZMachine$Memory$wordLength)) : (routineAddr + 1);
			return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
				_Utils_update(
					machine,
					{
						callStack: A2($elm$core$List$cons, frame, machine.callStack),
						pc: firstInstrAddr,
						stack: _List_Nil
					}));
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeCheckArgCount = F3(
	function (instr, ops, machine) {
		var currentArgCount = function () {
			var _v0 = machine.callStack;
			if (_v0.b) {
				var frame = _v0.a;
				return frame.argCount;
			} else {
				return 0;
			}
		}();
		var argNum = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		return A3(
			$techbelly$elm_zmachine$ZMachine$Execute$executeBranch,
			instr,
			_Utils_cmp(argNum, currentArgCount) < 1,
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$copyMemBackwardHelp = F4(
	function (src, dest, i, mem) {
		copyMemBackwardHelp:
		while (true) {
			if (i < 0) {
				return mem;
			} else {
				var _byte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, src + i, mem);
				var $temp$src = src,
					$temp$dest = dest,
					$temp$i = i - 1,
					$temp$mem = A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, dest + i, _byte, mem);
				src = $temp$src;
				dest = $temp$dest;
				i = $temp$i;
				mem = $temp$mem;
				continue copyMemBackwardHelp;
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$copyMemBackward = F4(
	function (src, dest, len, mem) {
		return A4($techbelly$elm_zmachine$ZMachine$Execute$copyMemBackwardHelp, src, dest, len - 1, mem);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$copyMemForwardHelp = F5(
	function (src, dest, i, len, mem) {
		copyMemForwardHelp:
		while (true) {
			if (_Utils_cmp(i, len) > -1) {
				return mem;
			} else {
				var _byte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, src + i, mem);
				var $temp$src = src,
					$temp$dest = dest,
					$temp$i = i + 1,
					$temp$len = len,
					$temp$mem = A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, dest + i, _byte, mem);
				src = $temp$src;
				dest = $temp$dest;
				i = $temp$i;
				len = $temp$len;
				mem = $temp$mem;
				continue copyMemForwardHelp;
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$copyMemForward = F4(
	function (src, dest, len, mem) {
		return A5($techbelly$elm_zmachine$ZMachine$Execute$copyMemForwardHelp, src, dest, 0, len, mem);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$zeroMemory = F3(
	function (addr, len, mem) {
		zeroMemory:
		while (true) {
			if (len <= 0) {
				return mem;
			} else {
				var $temp$addr = addr + 1,
					$temp$len = len - 1,
					$temp$mem = A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, addr, 0, mem);
				addr = $temp$addr;
				len = $temp$len;
				mem = $temp$mem;
				continue zeroMemory;
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeCopyTable = F2(
	function (ops, machine) {
		var size = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 2, ops));
		var second = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var first = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		return (!second) ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{
					memory: A3(
						$techbelly$elm_zmachine$ZMachine$Execute$zeroMemory,
						first,
						$elm$core$Basics$abs(size),
						machine.memory)
				})) : ((size >= 0) ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{
					memory: A4($techbelly$elm_zmachine$ZMachine$Execute$copyMemForward, first, second, size, machine.memory)
				})) : $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{
					memory: A4(
						$techbelly$elm_zmachine$ZMachine$Execute$copyMemBackward,
						first,
						second,
						$elm$core$Basics$abs(size),
						machine.memory)
				})));
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$firstPropertyAddress = F2(
	function (objNum, mem) {
		var propTableAddr = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$propertyTableAddress, objNum, mem);
		var nameLen = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, propTableAddr, mem);
		return (propTableAddr + 1) + (nameLen * $techbelly$elm_zmachine$ZMachine$Memory$wordLength);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$propertyNumberAt = F2(
	function (addr, mem) {
		return A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem) & $techbelly$elm_zmachine$ZMachine$Memory$profile(mem).propertyNumberMask;
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$decodePropertyHeader = F2(
	function (addr, mem) {
		var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem);
		var firstByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem);
		var _v0 = p.version;
		if (_v0.$ === 'V3') {
			return {dataLen: (firstByte >>> 5) + 1, headerSize: 1, num: firstByte & p.propertyNumberMask};
		} else {
			if (!(!(firstByte & 128))) {
				var secondByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr + 1, mem);
				var rawLen = secondByte & 63;
				return {
					dataLen: (!rawLen) ? 64 : rawLen,
					headerSize: 2,
					num: firstByte & p.propertyNumberMask
				};
			} else {
				return {
					dataLen: (!(!(firstByte & 64))) ? 2 : 1,
					headerSize: 1,
					num: firstByte & p.propertyNumberMask
				};
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$walkToNextNumber = F3(
	function (addr, targetPropNum, mem) {
		walkToNextNumber:
		while (true) {
			if (!A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem)) {
				return 0;
			} else {
				var decoded = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$decodePropertyHeader, addr, mem);
				var nextAddr = (addr + decoded.headerSize) + decoded.dataLen;
				if (_Utils_eq(decoded.num, targetPropNum)) {
					return A2($techbelly$elm_zmachine$ZMachine$ObjectTable$propertyNumberAt, nextAddr, mem);
				} else {
					var $temp$addr = nextAddr,
						$temp$targetPropNum = targetPropNum,
						$temp$mem = mem;
					addr = $temp$addr;
					targetPropNum = $temp$targetPropNum;
					mem = $temp$mem;
					continue walkToNextNumber;
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$nextPropertyNumber = F3(
	function (objNum, propNum, mem) {
		var addr = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$firstPropertyAddress, objNum, mem);
		return (!propNum) ? A2($techbelly$elm_zmachine$ZMachine$ObjectTable$propertyNumberAt, addr, mem) : A3($techbelly$elm_zmachine$ZMachine$ObjectTable$walkToNextNumber, addr, propNum, mem);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeGetNextProp = F3(
	function (instr, ops, machine) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
			instr,
			A3(
				$techbelly$elm_zmachine$ZMachine$ObjectTable$nextPropertyNumber,
				A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
				A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops),
				machine.memory),
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeGetParent = F3(
	function (instr, ops, machine) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
			instr,
			A2(
				$techbelly$elm_zmachine$ZMachine$ObjectTable$parent,
				A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
				machine.memory),
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$findPropertyAt = F3(
	function (addr, propNum, mem) {
		findPropertyAt:
		while (true) {
			if (!A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem)) {
				return $elm$core$Maybe$Nothing;
			} else {
				var decoded = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$decodePropertyHeader, addr, mem);
				var dataAddr = addr + decoded.headerSize;
				if (_Utils_eq(decoded.num, propNum)) {
					return $elm$core$Maybe$Just(
						_Utils_Tuple2(dataAddr, decoded.dataLen));
				} else {
					if (_Utils_cmp(decoded.num, propNum) < 0) {
						return $elm$core$Maybe$Nothing;
					} else {
						var $temp$addr = dataAddr + decoded.dataLen,
							$temp$propNum = propNum,
							$temp$mem = mem;
						addr = $temp$addr;
						propNum = $temp$propNum;
						mem = $temp$mem;
						continue findPropertyAt;
					}
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$findProperty = F3(
	function (objNum, propNum, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$findPropertyAt,
			A2($techbelly$elm_zmachine$ZMachine$ObjectTable$firstPropertyAddress, objNum, mem),
			propNum,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$propertyDefault = F2(
	function (propNum, mem) {
		return A2(
			$techbelly$elm_zmachine$ZMachine$Memory$readWord,
			$techbelly$elm_zmachine$ZMachine$Header$objectTableAddress(mem) + ((propNum - 1) * $techbelly$elm_zmachine$ZMachine$Memory$wordLength),
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeGetProp = F3(
	function (instr, ops, machine) {
		var propNum = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var obj = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$ObjectTable$findProperty, obj, propNum, machine.memory);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var dataAddr = _v1.a;
			var dataLen = _v1.b;
			var val = (dataLen === 1) ? A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, dataAddr, machine.memory) : A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, dataAddr, machine.memory);
			return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, val, machine);
		} else {
			return A3(
				$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
				instr,
				A2($techbelly$elm_zmachine$ZMachine$ObjectTable$propertyDefault, propNum, machine.memory),
				machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeGetPropAddr = F3(
	function (instr, ops, machine) {
		var propNum = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var obj = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$ObjectTable$findProperty, obj, propNum, machine.memory);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var dataAddr = _v1.a;
			return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, dataAddr, machine);
		} else {
			return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, 0, machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$propertyLength = F2(
	function (dataAddr, mem) {
		if (!dataAddr) {
			return 0;
		} else {
			var prevByte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, dataAddr - 1, mem);
			var _v0 = $techbelly$elm_zmachine$ZMachine$Memory$profile(mem).version;
			if (_v0.$ === 'V3') {
				return (prevByte >>> 5) + 1;
			} else {
				if (!(!(prevByte & 128))) {
					var rawLen = prevByte & 63;
					return (!rawLen) ? 64 : rawLen;
				} else {
					if (!(!(prevByte & 64))) {
						return 2;
					} else {
						return 1;
					}
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeGetPropLen = F3(
	function (instr, ops, machine) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
			instr,
			A2(
				$techbelly$elm_zmachine$ZMachine$ObjectTable$propertyLength,
				A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
				machine.memory),
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeGetTreeLink = F4(
	function (accessor, instr, ops, machine) {
		var target = A2(
			accessor,
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
			machine.memory);
		var m = function () {
			var _v0 = instr.store;
			if (_v0.$ === 'Just') {
				var varRef = _v0.a;
				return A3($techbelly$elm_zmachine$ZMachine$State$writeVariable, varRef, target, machine);
			} else {
				return machine;
			}
		}();
		return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, !(!target), m);
	});
var $techbelly$elm_zmachine$ZMachine$State$peekStack = function (machine) {
	var _v0 = machine.stack;
	if (_v0.b) {
		var top = _v0.a;
		return top;
	} else {
		return 0;
	}
};
var $techbelly$elm_zmachine$ZMachine$Stack$getLocal = F2(
	function (n, frame) {
		return A2(
			$elm$core$Maybe$withDefault,
			0,
			A2($elm$core$Array$get, n - 1, frame.locals));
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (_v0.$ === 'Just') {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.e.d.$ === 'RBNode_elm_builtin') && (dict.e.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) && (dict.e.$ === 'RBNode_elm_builtin')) {
		if ((dict.d.d.$ === 'RBNode_elm_builtin') && (dict.d.d.a.$ === 'Red')) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				$elm$core$Dict$Red,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr.$ === 'Black') {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					$elm$core$Dict$Black,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Red')) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Red, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === 'RBNode_elm_builtin') && (right.a.$ === 'Black')) {
					if (right.d.$ === 'RBNode_elm_builtin') {
						if (right.d.a.$ === 'Black') {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === 'RBNode_elm_builtin') && (dict.d.$ === 'RBNode_elm_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_elm_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBEmpty_elm_builtin') {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === 'RBNode_elm_builtin') && (left.a.$ === 'Black')) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === 'RBNode_elm_builtin') && (lLeft.a.$ === 'Red')) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === 'RBNode_elm_builtin') {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === 'RBNode_elm_builtin') {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === 'RBNode_elm_builtin') {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === 'RBNode_elm_builtin') && (_v0.a.$ === 'Red')) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, $elm$core$Dict$Black, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$update = F3(
	function (targetKey, alter, dictionary) {
		var _v0 = alter(
			A2($elm$core$Dict$get, targetKey, dictionary));
		if (_v0.$ === 'Just') {
			var value = _v0.a;
			return A3($elm$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($elm$core$Dict$remove, targetKey, dictionary);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Player$noteGlobalRead = F2(
	function (varNum, tracking) {
		return A2($elm$core$Dict$member, varNum, tracking.globalCandidates) ? _Utils_update(
			tracking,
			{
				globalCandidates: A3(
					$elm$core$Dict$update,
					varNum,
					$elm$core$Maybe$map(
						$elm$core$Basics$add(1)),
					tracking.globalCandidates)
			}) : tracking;
	});
var $techbelly$elm_zmachine$ZMachine$State$popStack = function (machine) {
	var _v0 = machine.stack;
	if (_v0.b) {
		var top = _v0.a;
		var rest = _v0.b;
		return _Utils_Tuple2(
			top,
			_Utils_update(
				machine,
				{stack: rest}));
	} else {
		return _Utils_Tuple2(0, machine);
	}
};
var $techbelly$elm_zmachine$ZMachine$State$readVariable = F2(
	function (ref, machine) {
		switch (ref.$) {
			case 'Stack':
				return $techbelly$elm_zmachine$ZMachine$State$popStack(machine);
			case 'Local':
				var n = ref.a;
				var _v1 = machine.callStack;
				if (_v1.b) {
					var frame = _v1.a;
					return _Utils_Tuple2(
						A2($techbelly$elm_zmachine$ZMachine$Stack$getLocal, n, frame),
						machine);
				} else {
					return _Utils_Tuple2(0, machine);
				}
			default:
				var n = ref.a;
				return _Utils_Tuple2(
					A2(
						$techbelly$elm_zmachine$ZMachine$Memory$readWord,
						A2($techbelly$elm_zmachine$ZMachine$State$globalAddress, n, machine.memory),
						machine.memory),
					_Utils_update(
						machine,
						{
							playerTracking: A2($techbelly$elm_zmachine$ZMachine$Player$noteGlobalRead, n, machine.playerTracking)
						}));
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$readIndirect = F2(
	function (varNum, machine) {
		return (!varNum) ? _Utils_Tuple2(
			$techbelly$elm_zmachine$ZMachine$State$peekStack(machine),
			machine) : A2(
			$techbelly$elm_zmachine$ZMachine$State$readVariable,
			$techbelly$elm_zmachine$ZMachine$Opcode$variableRefFromByte(varNum),
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$State$pokeStack = F2(
	function (value, machine) {
		var _v0 = machine.stack;
		if (_v0.b) {
			var rest = _v0.b;
			return _Utils_update(
				machine,
				{
					stack: A2(
						$elm$core$List$cons,
						$techbelly$elm_zmachine$Library$IntExtra$toUnsignedInt16(value),
						rest)
				});
		} else {
			return machine;
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$writeIndirect = F3(
	function (varNum, value, machine) {
		return (!varNum) ? A2($techbelly$elm_zmachine$ZMachine$State$pokeStack, value, machine) : A3(
			$techbelly$elm_zmachine$ZMachine$State$writeVariable,
			$techbelly$elm_zmachine$ZMachine$Opcode$variableRefFromByte(varNum),
			value,
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$adjustIndirect = F3(
	function (varNum, delta, machine) {
		var _v0 = A2($techbelly$elm_zmachine$ZMachine$Execute$readIndirect, varNum, machine);
		var current = _v0.a;
		var m = _v0.b;
		var newValue = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(current) + delta;
		return _Utils_Tuple2(
			newValue,
			A3($techbelly$elm_zmachine$ZMachine$Execute$writeIndirect, varNum, newValue, m));
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeIncDec = F3(
	function (delta, ops, machine) {
		var _v0 = A3(
			$techbelly$elm_zmachine$ZMachine$Execute$adjustIndirect,
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
			delta,
			machine);
		var m = _v0.b;
		return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeIncDecCheck = F5(
	function (delta, cmp, instr, ops, machine) {
		var checkValue = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops));
		var _v0 = A3(
			$techbelly$elm_zmachine$ZMachine$Execute$adjustIndirect,
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops),
			delta,
			machine);
		var newValue = _v0.a;
		var m = _v0.b;
		return A3(
			$techbelly$elm_zmachine$ZMachine$Execute$executeBranch,
			instr,
			A2(cmp, newValue, checkValue),
			m);
	});
var $techbelly$elm_zmachine$ZMachine$Player$isRoom = F2(
	function (objNum, mem) {
		var p = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$parent, objNum, mem);
		return (!(!p)) && (!A2($techbelly$elm_zmachine$ZMachine$ObjectTable$parent, p, mem));
	});
var $elm$core$Dict$fromList = function (assocs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, dict) {
				var key = _v0.a;
				var value = _v0.b;
				return A3($elm$core$Dict$insert, key, value, dict);
			}),
		$elm$core$Dict$empty,
		assocs);
};
var $techbelly$elm_zmachine$ZMachine$Player$lastGlobalVar = 255;
var $techbelly$elm_zmachine$ZMachine$Player$scanGlobalsForValue = F2(
	function (target, mem) {
		return $elm$core$Dict$fromList(
			A2(
				$elm$core$List$filterMap,
				function (n) {
					return _Utils_eq(
						A2($techbelly$elm_zmachine$ZMachine$Player$readGlobal, n, mem),
						target) ? $elm$core$Maybe$Just(
						_Utils_Tuple2(n, 0)) : $elm$core$Maybe$Nothing;
				},
				A2($elm$core$List$range, $techbelly$elm_zmachine$ZMachine$Player$firstGlobalVar, $techbelly$elm_zmachine$ZMachine$Player$lastGlobalVar)));
	});
var $techbelly$elm_zmachine$ZMachine$Player$noteInsert = F4(
	function (obj, dest, mem, tracking) {
		return (!(!tracking.playerObject)) ? tracking : (A2($techbelly$elm_zmachine$ZMachine$Player$isRoom, dest, mem) ? _Utils_update(
			tracking,
			{
				globalCandidates: A2($techbelly$elm_zmachine$ZMachine$Player$scanGlobalsForValue, obj, mem),
				playerObject: obj
			}) : tracking);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$writeRelation = F4(
	function (offset, objNum, value, mem) {
		if (!objNum) {
			return mem;
		} else {
			var addr = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$address, objNum, mem) + offset;
			return ($techbelly$elm_zmachine$ZMachine$Memory$profile(mem).objectPointerSize === 1) ? A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, addr, value, mem) : A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, addr, value, mem);
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$setChild = F3(
	function (objNum, value, mem) {
		return A4(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$writeRelation,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).childOffset,
			objNum,
			value,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$sibling = F2(
	function (objNum, mem) {
		return A3(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$readRelation,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).siblingOffset,
			objNum,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$setSibling = F3(
	function (objNum, value, mem) {
		return A4(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$writeRelation,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).siblingOffset,
			objNum,
			value,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$unlinkFromSiblingChain = F3(
	function (current, target, mem) {
		unlinkFromSiblingChain:
		while (true) {
			if (!current) {
				return mem;
			} else {
				var next = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$sibling, current, mem);
				if (_Utils_eq(next, target)) {
					return A3(
						$techbelly$elm_zmachine$ZMachine$ObjectTable$setSibling,
						current,
						A2($techbelly$elm_zmachine$ZMachine$ObjectTable$sibling, target, mem),
						mem);
				} else {
					var $temp$current = next,
						$temp$target = target,
						$temp$mem = mem;
					current = $temp$current;
					target = $temp$target;
					mem = $temp$mem;
					continue unlinkFromSiblingChain;
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$removeFromParent = F2(
	function (objNum, mem) {
		var p = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$parent, objNum, mem);
		if (!p) {
			return mem;
		} else {
			var parentChild = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$child, p, mem);
			return _Utils_eq(parentChild, objNum) ? A3(
				$techbelly$elm_zmachine$ZMachine$ObjectTable$setChild,
				p,
				A2($techbelly$elm_zmachine$ZMachine$ObjectTable$sibling, objNum, mem),
				mem) : A3($techbelly$elm_zmachine$ZMachine$ObjectTable$unlinkFromSiblingChain, parentChild, objNum, mem);
		}
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$setParent = F3(
	function (objNum, value, mem) {
		return A4(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$writeRelation,
			$techbelly$elm_zmachine$ZMachine$Memory$profile(mem).parentOffset,
			objNum,
			value,
			mem);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeInsertObj = F2(
	function (ops, machine) {
		var obj = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var dest = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var mem = function (m) {
			var destChild = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$child, dest, m);
			return A3(
				$techbelly$elm_zmachine$ZMachine$ObjectTable$setChild,
				dest,
				obj,
				A3(
					$techbelly$elm_zmachine$ZMachine$ObjectTable$setSibling,
					obj,
					destChild,
					A3($techbelly$elm_zmachine$ZMachine$ObjectTable$setParent, obj, dest, m)));
		}(
			A2($techbelly$elm_zmachine$ZMachine$ObjectTable$removeFromParent, obj, machine.memory));
		return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{
					memory: mem,
					playerTracking: A4($techbelly$elm_zmachine$ZMachine$Player$noteInsert, obj, dest, mem, machine.playerTracking)
				}));
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeJe = F3(
	function (instr, ops, machine) {
		var rest = A2($elm$core$List$drop, 1, ops);
		var a = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var matches = A2($elm$core$List$member, a, rest);
		return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, matches, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeJin = F3(
	function (instr, ops, machine) {
		var parent = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var child = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var childParent = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$parent, child, machine.memory);
		return A3(
			$techbelly$elm_zmachine$ZMachine$Execute$executeBranch,
			instr,
			_Utils_eq(childParent, parent),
			machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeLogShift = F3(
	function (instr, ops, machine) {
		var places = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops));
		var number = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var result = (places >= 0) ? ((number << places) & 65535) : (number >>> $elm$core$Basics$abs(places));
		return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, result, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Window$notePrintObj = F2(
	function (objNum, uw) {
		return (!uw.firstPrintedObj) ? _Utils_update(
			uw,
			{firstPrintedObj: objNum}) : uw;
	});
var $techbelly$elm_zmachine$ZMachine$Types$PrintObject = function (a) {
	return {$: 'PrintObject', a: a};
};
var $techbelly$elm_zmachine$ZMachine$State$charToZscii = function (ch) {
	if (_Utils_eq(
		ch,
		_Utils_chr('\n'))) {
		return $elm$core$Maybe$Just(13);
	} else {
		var code = $elm$core$Char$toCode(ch);
		return ((code >= 32) && (code <= 126)) ? $elm$core$Maybe$Just(code) : $elm$core$Maybe$Nothing;
	}
};
var $techbelly$elm_zmachine$ZMachine$Window$printText = F2(
	function (str, uw) {
		var row = A2(
			$elm$core$Maybe$withDefault,
			A2(
				$elm$core$Array$repeat,
				uw.width,
				_Utils_chr(' ')),
			A2($elm$core$Dict$get, uw.cursorRow, uw.rows));
		var chars = $elm$core$String$toList(str);
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (ch, _v1) {
					var col = _v1.a;
					var arr = _v1.b;
					return (_Utils_cmp(
						col,
						$elm$core$Array$length(arr)) < 0) ? _Utils_Tuple2(
						col + 1,
						A3($elm$core$Array$set, col, ch, arr)) : _Utils_Tuple2(col + 1, arr);
				}),
			_Utils_Tuple2(uw.cursorCol - 1, row),
			chars);
		var newCol = _v0.a;
		var updatedRow = _v0.b;
		return _Utils_update(
			uw,
			{
				cursorCol: newCol + 1,
				rows: A3($elm$core$Dict$insert, uw.cursorRow, updatedRow, uw.rows)
			});
	});
var $techbelly$elm_zmachine$ZMachine$State$outputText = F2(
	function (str, machine) {
		var _v0 = machine.stream3Stack;
		if (_v0.b) {
			var entry = _v0.a;
			var rest = _v0.b;
			var chars = $elm$core$String$toList(str);
			var _v1 = A3(
				$elm$core$List$foldl,
				F2(
					function (ch, _v2) {
						var m = _v2.a;
						var n = _v2.b;
						var _v3 = $techbelly$elm_zmachine$ZMachine$State$charToZscii(ch);
						if (_v3.$ === 'Just') {
							var code = _v3.a;
							return _Utils_Tuple2(
								A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, (entry.tableAddr + 2) + n, code, m),
								n + 1);
						} else {
							return _Utils_Tuple2(m, n);
						}
					}),
				_Utils_Tuple2(machine.memory, entry.count),
				chars);
			var mem = _v1.a;
			var newCount = _v1.b;
			return _Utils_update(
				machine,
				{
					memory: mem,
					stream3Stack: A2(
						$elm$core$List$cons,
						_Utils_update(
							entry,
							{count: newCount}),
						rest)
				});
		} else {
			var _v4 = machine.currentWindow;
			if (_v4.$ === 'Lower') {
				return A2(
					$techbelly$elm_zmachine$ZMachine$State$appendOutput,
					$techbelly$elm_zmachine$ZMachine$Types$PrintText(str),
					machine);
			} else {
				return _Utils_update(
					machine,
					{
						upperWindow: A2($techbelly$elm_zmachine$ZMachine$Window$printText, str, machine.upperWindow)
					});
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$State$outputObjectName = F2(
	function (str, machine) {
		var _v0 = _Utils_Tuple2(machine.stream3Stack, machine.currentWindow);
		if ((!_v0.a.b) && (_v0.b.$ === 'Lower')) {
			var _v1 = _v0.b;
			return A2(
				$techbelly$elm_zmachine$ZMachine$State$appendOutput,
				$techbelly$elm_zmachine$ZMachine$Types$PrintObject(str),
				machine);
		} else {
			return A2($techbelly$elm_zmachine$ZMachine$State$outputText, str, machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executePrintObj = F2(
	function (ops, machine) {
		var objNum = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var noted = function () {
			var _v0 = machine.currentWindow;
			if (_v0.$ === 'Upper') {
				return _Utils_update(
					machine,
					{
						upperWindow: A2($techbelly$elm_zmachine$ZMachine$Window$notePrintObj, objNum, machine.upperWindow)
					});
			} else {
				return machine;
			}
		}();
		var name = A2($techbelly$elm_zmachine$ZMachine$ObjectTable$shortName, objNum, machine.memory);
		return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			A2($techbelly$elm_zmachine$ZMachine$State$outputObjectName, name, noted));
	});
var $techbelly$elm_zmachine$ZMachine$Window$newLine = function (uw) {
	return _Utils_update(
		uw,
		{cursorCol: 1, cursorRow: uw.cursorRow + 1});
};
var $techbelly$elm_zmachine$ZMachine$State$outputNewLine = function (machine) {
	var _v0 = machine.stream3Stack;
	if (_v0.b) {
		var entry = _v0.a;
		var rest = _v0.b;
		var mem = A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, (entry.tableAddr + 2) + entry.count, 13, machine.memory);
		return _Utils_update(
			machine,
			{
				memory: mem,
				stream3Stack: A2(
					$elm$core$List$cons,
					_Utils_update(
						entry,
						{count: entry.count + 1}),
					rest)
			});
	} else {
		var _v1 = machine.currentWindow;
		if (_v1.$ === 'Lower') {
			return A2(
				$techbelly$elm_zmachine$ZMachine$State$appendOutput,
				$techbelly$elm_zmachine$ZMachine$Types$PrintText('\n'),
				machine);
		} else {
			return _Utils_update(
				machine,
				{
					upperWindow: $techbelly$elm_zmachine$ZMachine$Window$newLine(machine.upperWindow)
				});
		}
	}
};
var $techbelly$elm_zmachine$ZMachine$Execute$printTableRows = F6(
	function (addr, width, height, skip, row, machine) {
		printTableRows:
		while (true) {
			if (_Utils_cmp(row, height) > -1) {
				return $techbelly$elm_zmachine$ZMachine$Execute$Continue(machine);
			} else {
				var rowAddr = addr + (row * (width + skip));
				var text = $elm$core$String$fromList(
					A2(
						$elm$core$List$map,
						function (col) {
							return $elm$core$Char$fromCode(
								A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, rowAddr + col, machine.memory));
						},
						A2($elm$core$List$range, 0, width - 1)));
				var m1 = A2($techbelly$elm_zmachine$ZMachine$State$outputText, text, machine);
				var m2 = (_Utils_cmp(row, height - 1) < 0) ? $techbelly$elm_zmachine$ZMachine$State$outputNewLine(m1) : m1;
				var $temp$addr = addr,
					$temp$width = width,
					$temp$height = height,
					$temp$skip = skip,
					$temp$row = row + 1,
					$temp$machine = m2;
				addr = $temp$addr;
				width = $temp$width;
				height = $temp$height;
				skip = $temp$skip;
				row = $temp$row;
				machine = $temp$machine;
				continue printTableRows;
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executePrintTable = F2(
	function (ops, machine) {
		var width = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var skip = ($elm$core$List$length(ops) > 3) ? A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 3, ops) : 0;
		var height = ($elm$core$List$length(ops) > 2) ? A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 2, ops) : 1;
		var addr = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		return A6($techbelly$elm_zmachine$ZMachine$Execute$printTableRows, addr, width, height, skip, 0, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executePutProp = F2(
	function (ops, machine) {
		var propNum = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var obj = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var _v0 = A3($techbelly$elm_zmachine$ZMachine$ObjectTable$findProperty, obj, propNum, machine.memory);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var dataAddr = _v1.a;
			var dataLen = _v1.b;
			var value = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 2, ops);
			var mem = (dataLen === 1) ? A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, dataAddr, value, machine.memory) : A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, dataAddr, value, machine.memory);
			return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
				_Utils_update(
					machine,
					{memory: mem}));
		} else {
			return $techbelly$elm_zmachine$ZMachine$Execute$Continue(machine);
		}
	});
var $techbelly$elm_zmachine$Library$IntExtra$xorshift = function (seed) {
	var s1 = seed ^ (seed << 13);
	var s2 = s1 ^ (s1 >>> 17);
	var s3 = s2 ^ (s2 << 5);
	var next = s3 & 2147483647;
	return _Utils_Tuple2(next, next);
};
var $techbelly$elm_zmachine$ZMachine$Execute$executeRandom = F3(
	function (instr, ops, machine) {
		var range = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(
			A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops));
		if (range <= 0) {
			var newSeed = (!range) ? (machine.randomState.count + 12345) : $elm$core$Basics$abs(range);
			return A3(
				$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
				instr,
				0,
				_Utils_update(
					machine,
					{
						randomState: {count: machine.randomState.count + 1, seed: newSeed}
					}));
		} else {
			var rs = machine.randomState;
			var _v0 = $techbelly$elm_zmachine$Library$IntExtra$xorshift(rs.seed);
			var value = _v0.a;
			var newSeed = _v0.b;
			var result = A2($elm$core$Basics$modBy, range, value) + 1;
			return A3(
				$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
				instr,
				result,
				_Utils_update(
					machine,
					{
						randomState: {count: rs.count + 1, seed: newSeed}
					}));
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeRemoveObj = F2(
	function (ops, machine) {
		var obj = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var mem = A3(
			$techbelly$elm_zmachine$ZMachine$ObjectTable$setSibling,
			obj,
			0,
			A3(
				$techbelly$elm_zmachine$ZMachine$ObjectTable$setParent,
				obj,
				0,
				A2($techbelly$elm_zmachine$ZMachine$ObjectTable$removeFromParent, obj, machine.memory)));
		return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{memory: mem}));
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeRestore = F2(
	function (_v0, machine) {
		return $techbelly$elm_zmachine$ZMachine$Execute$NeedRestore(machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeSave = F2(
	function (_v0, machine) {
		var snap = $techbelly$elm_zmachine$ZMachine$Snapshot$capture(
			{callStack: machine.callStack, memory: machine.memory, pc: machine.pc, resumeKind: $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeByStoreResult, stack: machine.stack});
		return A2($techbelly$elm_zmachine$ZMachine$Execute$NeedSave, snap, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$storeResultRaw = F3(
	function (instr, value, machine) {
		var _v0 = instr.store;
		if (_v0.$ === 'Just') {
			var varRef = _v0.a;
			return A3($techbelly$elm_zmachine$ZMachine$State$writeVariable, varRef, value, machine);
		} else {
			return machine;
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$scanTableLoop = F8(
	function (x, table, len, fieldLen, isWord, i, instr, machine) {
		scanTableLoop:
		while (true) {
			if (_Utils_cmp(i, len) > -1) {
				var m1 = A3($techbelly$elm_zmachine$ZMachine$Execute$storeResultRaw, instr, 0, machine);
				return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, false, m1);
			} else {
				var addr = table + (i * fieldLen);
				var val = isWord ? A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, addr, machine.memory) : A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, machine.memory);
				if (_Utils_eq(val, x)) {
					var m1 = A3($techbelly$elm_zmachine$ZMachine$Execute$storeResultRaw, instr, addr, machine);
					return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, true, m1);
				} else {
					var $temp$x = x,
						$temp$table = table,
						$temp$len = len,
						$temp$fieldLen = fieldLen,
						$temp$isWord = isWord,
						$temp$i = i + 1,
						$temp$instr = instr,
						$temp$machine = machine;
					x = $temp$x;
					table = $temp$table;
					len = $temp$len;
					fieldLen = $temp$fieldLen;
					isWord = $temp$isWord;
					i = $temp$i;
					instr = $temp$instr;
					machine = $temp$machine;
					continue scanTableLoop;
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeScanTable = F3(
	function (instr, ops, machine) {
		var x = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var table = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var len = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 2, ops);
		var form = ($elm$core$List$length(ops) > 3) ? A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 3, ops) : 130;
		var isWord = !(!(form & 128));
		var fieldLen = form & 127;
		return A8($techbelly$elm_zmachine$ZMachine$Execute$scanTableLoop, x, table, len, fieldLen, isWord, 0, instr, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Types$ScoreAndTurns = F2(
	function (a, b) {
		return {$: 'ScoreAndTurns', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Header$StatusLineType = {$: 'StatusLineType'};
var $techbelly$elm_zmachine$ZMachine$Types$TimeOfDay = F2(
	function (a, b) {
		return {$: 'TimeOfDay', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Header$flag1Bit = function (flag) {
	switch (flag.$) {
		case 'StatusLineType':
			return 1 << 1;
		case 'StoryFileSplit':
			return 1 << 2;
		case 'StatusLineNotAvailable':
			return 1 << 4;
		case 'ScreenSplitAvailable':
			return 1 << 5;
		default:
			return 1 << 6;
	}
};
var $techbelly$elm_zmachine$ZMachine$Header$flags1 = function (mem) {
	return A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, 1, mem);
};
var $techbelly$elm_zmachine$ZMachine$Header$testFlag1 = F2(
	function (flag, mem) {
		return !(!($techbelly$elm_zmachine$ZMachine$Header$flags1(mem) & $techbelly$elm_zmachine$ZMachine$Header$flag1Bit(flag)));
	});
var $techbelly$elm_zmachine$ZMachine$StatusLine$build = function (machine) {
	var mem = machine.memory;
	var globalsAddr = $techbelly$elm_zmachine$ZMachine$Header$globalVariablesAddress(mem);
	var locationObj = A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, globalsAddr, mem);
	var global2 = A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, globalsAddr + (2 * $techbelly$elm_zmachine$ZMachine$Memory$wordLength), mem);
	var global1 = A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, globalsAddr + $techbelly$elm_zmachine$ZMachine$Memory$wordLength, mem);
	var mode = A2($techbelly$elm_zmachine$ZMachine$Header$testFlag1, $techbelly$elm_zmachine$ZMachine$Header$StatusLineType, mem) ? A2($techbelly$elm_zmachine$ZMachine$Types$TimeOfDay, global1, global2) : A2(
		$techbelly$elm_zmachine$ZMachine$Types$ScoreAndTurns,
		$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(global1),
		global2);
	return {
		locationId: locationObj,
		locationName: A2($techbelly$elm_zmachine$ZMachine$ObjectTable$shortName, locationObj, mem),
		mode: mode
	};
};
var $techbelly$elm_zmachine$ZMachine$Execute$executeShowStatus = function (machine) {
	return $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory).hasStatusLine ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
		A2(
			$techbelly$elm_zmachine$ZMachine$State$appendOutput,
			$techbelly$elm_zmachine$ZMachine$Types$ShowStatusLine(
				$techbelly$elm_zmachine$ZMachine$StatusLine$build(machine)),
			machine)) : $techbelly$elm_zmachine$ZMachine$Execute$Continue(machine);
};
var $techbelly$elm_zmachine$ZMachine$Execute$NeedInput = F2(
	function (a, b) {
		return {$: 'NeedInput', a: a, b: b};
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeSread = F2(
	function (ops, machine) {
		var textBufAddr = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var parseBufAddr = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var maxLen = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, textBufAddr, machine.memory);
		return A2(
			$techbelly$elm_zmachine$ZMachine$Execute$NeedInput,
			{maxLength: maxLen, parseBufferAddr: parseBufAddr, textBufferAddr: textBufAddr},
			$techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory).hasStatusLine ? A2(
				$techbelly$elm_zmachine$ZMachine$State$appendOutput,
				$techbelly$elm_zmachine$ZMachine$Types$ShowStatusLine(
					$techbelly$elm_zmachine$ZMachine$StatusLine$build(machine)),
				machine) : machine);
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$testAttribute = F3(
	function (objNum, attr, mem) {
		if (!objNum) {
			return false;
		} else {
			var _v0 = A3($techbelly$elm_zmachine$ZMachine$ObjectTable$attributeLocation, objNum, attr, mem);
			var addr = _v0.a;
			var mask = _v0.b;
			return !(!(A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem) & mask));
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeTestAttr = F3(
	function (instr, ops, machine) {
		var obj = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var attr = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var hasAttr = A3($techbelly$elm_zmachine$ZMachine$ObjectTable$testAttribute, obj, attr, machine.memory);
		return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, hasAttr, machine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$readZsciiStringHelp = F3(
	function (addr, mem, acc) {
		readZsciiStringHelp:
		while (true) {
			var _byte = A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, addr, mem);
			if (!_byte) {
				return $elm$core$String$fromList(
					$elm$core$List$reverse(acc));
			} else {
				var $temp$addr = addr + 1,
					$temp$mem = mem,
					$temp$acc = A2(
					$elm$core$List$cons,
					$elm$core$Char$fromCode(_byte),
					acc);
				addr = $temp$addr;
				mem = $temp$mem;
				acc = $temp$acc;
				continue readZsciiStringHelp;
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$readZsciiString = F2(
	function (addr, mem) {
		return A3($techbelly$elm_zmachine$ZMachine$Execute$readZsciiStringHelp, addr, mem, _List_Nil);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$executeTokenise = F2(
	function (ops, machine) {
		var textBufAddr = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var parseBufAddr = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var p = $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory);
		var textStart = textBufAddr + p.textBufferOffset;
		var input = A2($techbelly$elm_zmachine$ZMachine$Execute$readZsciiString, textStart, machine.memory);
		return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
			_Utils_update(
				machine,
				{
					memory: A4($techbelly$elm_zmachine$ZMachine$Dictionary$tokenize, input, textBufAddr, parseBufAddr, machine.memory)
				}));
	});
var $techbelly$elm_zmachine$ZMachine$Window$getCursor = function (uw) {
	return _Utils_Tuple2(uw.cursorRow, uw.cursorCol);
};
var $techbelly$elm_zmachine$ZMachine$State$getCursor = function (machine) {
	return $techbelly$elm_zmachine$ZMachine$Window$getCursor(machine.upperWindow);
};
var $techbelly$elm_zmachine$Library$IntExtra$truncMod = F2(
	function (a, b) {
		return a - (A2($techbelly$elm_zmachine$Library$IntExtra$truncDiv, a, b) * b);
	});
var $techbelly$elm_zmachine$Library$IntExtra$modInt16 = $techbelly$elm_zmachine$Library$IntExtra$withSigned16($techbelly$elm_zmachine$Library$IntExtra$truncMod);
var $techbelly$elm_zmachine$Library$IntExtra$mulInt16 = $techbelly$elm_zmachine$Library$IntExtra$withSigned16($elm$core$Basics$mul);
var $techbelly$elm_zmachine$ZMachine$State$popStream3 = function (machine) {
	var _v0 = machine.stream3Stack;
	if (_v0.b) {
		var entry = _v0.a;
		var rest = _v0.b;
		return _Utils_update(
			machine,
			{
				memory: A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, entry.tableAddr, entry.count, machine.memory),
				stream3Stack: rest
			});
	} else {
		return machine;
	}
};
var $techbelly$elm_zmachine$ZMachine$State$pushStream3 = F2(
	function (tableAddr, machine) {
		return _Utils_update(
			machine,
			{
				stream3Stack: A2(
					$elm$core$List$cons,
					{count: 0, tableAddr: tableAddr},
					machine.stream3Stack)
			});
	});
var $techbelly$elm_zmachine$ZMachine$ObjectTable$setAttribute = $techbelly$elm_zmachine$ZMachine$ObjectTable$updateAttribute($elm$core$Bitwise$or);
var $techbelly$elm_zmachine$ZMachine$Window$setCursor = F3(
	function (row, col, uw) {
		return _Utils_update(
			uw,
			{cursorCol: col, cursorRow: row});
	});
var $techbelly$elm_zmachine$ZMachine$State$setCursor = F3(
	function (row, col, machine) {
		return _Utils_update(
			machine,
			{
				upperWindow: A3($techbelly$elm_zmachine$ZMachine$Window$setCursor, row, col, machine.upperWindow)
			});
	});
var $techbelly$elm_zmachine$ZMachine$Execute$setStream2 = F2(
	function (enabled, machine) {
		var streams = machine.outputStreams;
		return _Utils_update(
			machine,
			{
				outputStreams: _Utils_update(
					streams,
					{stream2: enabled})
			});
	});
var $techbelly$elm_zmachine$ZMachine$State$setWindow = F2(
	function (win, machine) {
		if (win.$ === 'Upper') {
			var uw = machine.upperWindow;
			return _Utils_update(
				machine,
				{
					currentWindow: $techbelly$elm_zmachine$ZMachine$Types$Upper,
					upperWindow: _Utils_update(
						uw,
						{firstPrintedObj: 0})
				});
		} else {
			return _Utils_update(
				machine,
				{currentWindow: $techbelly$elm_zmachine$ZMachine$Types$Lower});
		}
	});
var $techbelly$elm_zmachine$ZMachine$Window$split = F2(
	function (height, uw) {
		return _Utils_update(
			uw,
			{cursorCol: 1, cursorRow: 1, firstPrintedObj: 0, height: height});
	});
var $techbelly$elm_zmachine$ZMachine$State$splitWindow = F2(
	function (height, machine) {
		return _Utils_update(
			machine,
			{
				upperWindow: A2($techbelly$elm_zmachine$ZMachine$Window$split, height, machine.upperWindow)
			});
	});
var $techbelly$elm_zmachine$Library$IntExtra$subInt16 = $techbelly$elm_zmachine$Library$IntExtra$withSigned16($elm$core$Basics$sub);
var $techbelly$elm_zmachine$ZMachine$Execute$execute = F4(
	function (instr, nextPC, ops, machine) {
		var m = _Utils_update(
			machine,
			{pc: nextPC});
		var arg2 = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 2, ops);
		var arg1 = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 1, ops);
		var arg0 = A2($techbelly$elm_zmachine$ZMachine$Execute$operandAt, 0, ops);
		var _v0 = instr.opcode;
		switch (_v0.$) {
			case 'Op2':
				switch (_v0.a.$) {
					case 'Je':
						var _v1 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeJe, instr, ops, m);
					case 'Jl':
						var _v2 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$executeBranch,
							instr,
							_Utils_cmp(
								$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg0),
								$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg1)) < 0,
							m);
					case 'Jg':
						var _v3 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$executeBranch,
							instr,
							_Utils_cmp(
								$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg0),
								$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg1)) > 0,
							m);
					case 'DecChk':
						var _v4 = _v0.a;
						return A5($techbelly$elm_zmachine$ZMachine$Execute$executeIncDecCheck, -1, $elm$core$Basics$lt, instr, ops, m);
					case 'IncChk':
						var _v5 = _v0.a;
						return A5($techbelly$elm_zmachine$ZMachine$Execute$executeIncDecCheck, 1, $elm$core$Basics$gt, instr, ops, m);
					case 'Jin':
						var _v6 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeJin, instr, ops, m);
					case 'Test':
						var _v7 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$executeBranch,
							instr,
							_Utils_eq(arg0 & arg1, arg1),
							m);
					case 'Or':
						var _v8 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, arg0 | arg1, m);
					case 'And':
						var _v9 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, arg0 & arg1, m);
					case 'TestAttr':
						var _v10 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeTestAttr, instr, ops, m);
					case 'SetAttr':
						var _v11 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeAttrUpdate, $techbelly$elm_zmachine$ZMachine$ObjectTable$setAttribute, ops, m);
					case 'ClearAttr':
						var _v12 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeAttrUpdate, $techbelly$elm_zmachine$ZMachine$ObjectTable$clearAttribute, ops, m);
					case 'Store':
						var _v13 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A3($techbelly$elm_zmachine$ZMachine$Execute$writeIndirect, arg0, arg1, m));
					case 'InsertObj':
						var _v14 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeInsertObj, ops, m);
					case 'Loadw':
						var _v15 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$ZMachine$Memory$readWord, arg0 + ($techbelly$elm_zmachine$ZMachine$Memory$wordLength * arg1), m.memory),
							m);
					case 'Loadb':
						var _v16 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$ZMachine$Memory$readByte, arg0 + arg1, m.memory),
							m);
					case 'GetProp':
						var _v17 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeGetProp, instr, ops, m);
					case 'GetPropAddr':
						var _v18 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeGetPropAddr, instr, ops, m);
					case 'GetNextProp':
						var _v19 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeGetNextProp, instr, ops, m);
					case 'Add':
						var _v20 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$Library$IntExtra$addInt16, arg0, arg1),
							m);
					case 'Sub':
						var _v21 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$Library$IntExtra$subInt16, arg0, arg1),
							m);
					case 'Mul':
						var _v22 = _v0.a;
						return A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$Library$IntExtra$mulInt16, arg0, arg1),
							m);
					case 'Div':
						var _v23 = _v0.a;
						return (!arg1) ? A2($techbelly$elm_zmachine$ZMachine$Execute$Error, $techbelly$elm_zmachine$ZMachine$Types$DivisionByZero, m) : A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$Library$IntExtra$divInt16, arg0, arg1),
							m);
					case 'Mod':
						var _v24 = _v0.a;
						return (!arg1) ? A2($techbelly$elm_zmachine$ZMachine$Execute$Error, $techbelly$elm_zmachine$ZMachine$Types$DivisionByZero, m) : A3(
							$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
							instr,
							A2($techbelly$elm_zmachine$Library$IntExtra$modInt16, arg0, arg1),
							m);
					case 'CallS2':
						var _v25 = _v0.a;
						return A4(
							$techbelly$elm_zmachine$ZMachine$Execute$executeCall,
							instr,
							arg0,
							_List_fromArray(
								[arg1]),
							m);
					case 'CallN2':
						var _v26 = _v0.a;
						return A4(
							$techbelly$elm_zmachine$ZMachine$Execute$executeCall,
							instr,
							arg0,
							_List_fromArray(
								[arg1]),
							m);
					case 'SetColour':
						var _v27 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$appendOutput,
								A2($techbelly$elm_zmachine$ZMachine$Types$SetColour, arg0, arg1),
								m));
					case 'Throw':
						var _v28 = _v0.a;
						var framesToDrop = $elm$core$List$length(m.callStack) - arg1;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$executeReturn,
							arg0,
							_Utils_update(
								m,
								{
									callStack: A2($elm$core$List$drop, framesToDrop, m.callStack)
								}));
					default:
						var n = _v0.a.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$Error,
							$techbelly$elm_zmachine$ZMachine$Types$InvalidOpcode(n),
							m);
				}
			case 'Op1':
				switch (_v0.a.$) {
					case 'Jz':
						var _v29 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, !arg0, m);
					case 'GetSibling':
						var _v30 = _v0.a;
						return A4($techbelly$elm_zmachine$ZMachine$Execute$executeGetTreeLink, $techbelly$elm_zmachine$ZMachine$ObjectTable$sibling, instr, ops, m);
					case 'GetChild':
						var _v31 = _v0.a;
						return A4($techbelly$elm_zmachine$ZMachine$Execute$executeGetTreeLink, $techbelly$elm_zmachine$ZMachine$ObjectTable$child, instr, ops, m);
					case 'GetParent':
						var _v32 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeGetParent, instr, ops, m);
					case 'GetPropLen':
						var _v33 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeGetPropLen, instr, ops, m);
					case 'Inc':
						var _v34 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeIncDec, 1, ops, m);
					case 'Dec':
						var _v35 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeIncDec, -1, ops, m);
					case 'PrintAddr':
						var _v36 = _v0.a;
						var _v37 = A2($techbelly$elm_zmachine$ZMachine$Text$decodeZString, arg0, m.memory);
						var str = _v37.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$outputObjectName, str, m));
					case 'CallS1':
						var _v38 = _v0.a;
						return A4($techbelly$elm_zmachine$ZMachine$Execute$executeCall, instr, arg0, _List_Nil, m);
					case 'RemoveObj':
						var _v39 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeRemoveObj, ops, m);
					case 'PrintObj':
						var _v40 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executePrintObj, ops, m);
					case 'Ret':
						var _v41 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, arg0, m);
					case 'Jump':
						var _v42 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							_Utils_update(
								m,
								{
									pc: (m.pc + $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg0)) - 2
								}));
					case 'PrintPaddr':
						var _v43 = _v0.a;
						var _v44 = A2(
							$techbelly$elm_zmachine$ZMachine$Text$decodeZString,
							A2($techbelly$elm_zmachine$ZMachine$Memory$unpackAddress, arg0, m.memory),
							m.memory);
						var str = _v44.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$outputText, str, m));
					case 'Load':
						var _v45 = _v0.a;
						var _v46 = A2($techbelly$elm_zmachine$ZMachine$Execute$readIndirect, arg0, m);
						var val = _v46.a;
						var m2 = _v46.b;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, val, m2);
					case 'Not':
						var _v47 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, (~arg0) & 65535, m);
					case 'CallN1':
						var _v48 = _v0.a;
						return A4($techbelly$elm_zmachine$ZMachine$Execute$executeCall, instr, arg0, _List_Nil, m);
					default:
						var n = _v0.a.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$Error,
							$techbelly$elm_zmachine$ZMachine$Types$InvalidOpcode(n),
							m);
				}
			case 'Op0':
				switch (_v0.a.$) {
					case 'Rtrue':
						var _v49 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, 1, m);
					case 'Rfalse':
						var _v50 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, 0, m);
					case 'Print':
						var _v51 = _v0.a;
						var _v52 = instr.textLiteral;
						if (_v52.$ === 'Just') {
							var words = _v52.a;
							var str = A2($techbelly$elm_zmachine$ZMachine$Text$decodeZStringWords, words, m.memory);
							return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
								A2($techbelly$elm_zmachine$ZMachine$State$outputText, str, m));
						} else {
							return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m);
						}
					case 'PrintRet':
						var _v53 = _v0.a;
						var _v54 = instr.textLiteral;
						if (_v54.$ === 'Just') {
							var words = _v54.a;
							var str = A2($techbelly$elm_zmachine$ZMachine$Text$decodeZStringWords, words, m.memory);
							var m2 = $techbelly$elm_zmachine$ZMachine$State$outputNewLine(
								A2($techbelly$elm_zmachine$ZMachine$State$outputText, str, m));
							return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, 1, m2);
						} else {
							return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, 1, m);
						}
					case 'Nop':
						var _v55 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m);
					case 'Save':
						var _v56 = _v0.a;
						var resumeKind = function () {
							var _v57 = $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory).version;
							if (_v57.$ === 'V3') {
								return $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeByBranchTrue;
							} else {
								return $techbelly$elm_zmachine$ZMachine$Snapshot$ResumeByStoreResult;
							}
						}();
						var snap = $techbelly$elm_zmachine$ZMachine$Snapshot$capture(
							{callStack: machine.callStack, memory: machine.memory, pc: machine.pc, resumeKind: resumeKind, stack: machine.stack});
						return A2($techbelly$elm_zmachine$ZMachine$Execute$NeedSave, snap, machine);
					case 'Restore':
						var _v58 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$NeedRestore(machine);
					case 'Restart':
						var _v59 = _v0.a;
						var newMachine = $techbelly$elm_zmachine$ZMachine$State$init(m.originalMemory);
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(newMachine);
					case 'RetPopped':
						var _v60 = _v0.a;
						var _v61 = $techbelly$elm_zmachine$ZMachine$State$popStack(m);
						var val = _v61.a;
						var m2 = _v61.b;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeReturn, val, m2);
					case 'Pop':
						var _v62 = _v0.a;
						var _v63 = $techbelly$elm_zmachine$ZMachine$Memory$profile(machine.memory).version;
						if (_v63.$ === 'V3') {
							var _v64 = $techbelly$elm_zmachine$ZMachine$State$popStack(m);
							var m2 = _v64.b;
							return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m2);
						} else {
							return A3(
								$techbelly$elm_zmachine$ZMachine$Execute$storeResult,
								instr,
								$elm$core$List$length(m.callStack),
								m);
						}
					case 'Quit':
						var _v65 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Halted(m);
					case 'NewLine':
						var _v66 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							$techbelly$elm_zmachine$ZMachine$State$outputNewLine(m));
					case 'ShowStatus':
						var _v67 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$executeShowStatus(m);
					case 'Verify':
						var _v68 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, true, m);
					case 'Piracy':
						var _v69 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeBranch, instr, true, m);
					default:
						var n = _v0.a.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$Error,
							$techbelly$elm_zmachine$ZMachine$Types$InvalidOpcode(n),
							m);
				}
			case 'OpVar':
				switch (_v0.a.$) {
					case 'Call':
						var _v70 = _v0.a;
						return A4(
							$techbelly$elm_zmachine$ZMachine$Execute$executeCall,
							instr,
							arg0,
							A2($elm$core$List$drop, 1, ops),
							m);
					case 'Storew':
						var _v71 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							_Utils_update(
								m,
								{
									memory: A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, arg0 + ($techbelly$elm_zmachine$ZMachine$Memory$wordLength * arg1), arg2, m.memory)
								}));
					case 'Storeb':
						var _v72 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							_Utils_update(
								m,
								{
									memory: A3($techbelly$elm_zmachine$ZMachine$Memory$writeByte, arg0 + arg1, arg2, m.memory)
								}));
					case 'PutProp':
						var _v73 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executePutProp, ops, m);
					case 'Sread':
						var _v74 = _v0.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$executeSread,
							ops,
							_Utils_update(
								m,
								{pc: machine.pc}));
					case 'PrintChar':
						var _v75 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$outputText,
								$elm$core$String$fromChar(
									$techbelly$elm_zmachine$ZMachine$Text$zsciiToChar(arg0)),
								m));
					case 'PrintNum':
						var _v76 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$outputText,
								$elm$core$String$fromInt(
									$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg0)),
								m));
					case 'Random':
						var _v77 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeRandom, instr, ops, m);
					case 'Push':
						var _v78 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$pushStack, arg0, m));
					case 'Pull':
						var _v79 = _v0.a;
						var _v80 = $techbelly$elm_zmachine$ZMachine$State$popStack(m);
						var val = _v80.a;
						var m2 = _v80.b;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A3($techbelly$elm_zmachine$ZMachine$Execute$writeIndirect, arg0, val, m2));
					case 'SplitWindow':
						var _v81 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$splitWindow, arg0, m));
					case 'SetWindow':
						var _v82 = _v0.a;
						var win = (!arg0) ? $techbelly$elm_zmachine$ZMachine$Types$Lower : $techbelly$elm_zmachine$ZMachine$Types$Upper;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$setWindow, win, m));
					case 'OutputStream':
						var _v83 = _v0.a;
						var streamNum = $techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg0);
						return (streamNum === 3) ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$pushStream3, arg1, m)) : (_Utils_eq(streamNum, -3) ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							$techbelly$elm_zmachine$ZMachine$State$popStream3(m)) : ((streamNum === 2) ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$Execute$setStream2, true, m)) : (_Utils_eq(streamNum, -2) ? $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$Execute$setStream2, false, m)) : $techbelly$elm_zmachine$ZMachine$Execute$Continue(m))));
					case 'InputStream':
						var _v84 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m);
					case 'SoundEffect':
						var _v85 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$appendOutput,
								$techbelly$elm_zmachine$ZMachine$Types$PlaySound(arg0),
								m));
					case 'CallVs2':
						var _v86 = _v0.a;
						return A4(
							$techbelly$elm_zmachine$ZMachine$Execute$executeCall,
							instr,
							arg0,
							A2($elm$core$List$drop, 1, ops),
							m);
					case 'EraseWindow':
						var _v87 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$eraseWindow,
								$techbelly$elm_zmachine$Library$IntExtra$toSignedInt16(arg0),
								m));
					case 'EraseLine':
						var _v88 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2($techbelly$elm_zmachine$ZMachine$State$eraseLine, arg0, m));
					case 'SetCursor':
						var _v89 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A3($techbelly$elm_zmachine$ZMachine$State$setCursor, arg0, arg1, m));
					case 'GetCursor':
						var _v90 = _v0.a;
						var _v91 = $techbelly$elm_zmachine$ZMachine$State$getCursor(m);
						var row = _v91.a;
						var col = _v91.b;
						var mem = A3(
							$techbelly$elm_zmachine$ZMachine$Memory$writeWord,
							arg0 + $techbelly$elm_zmachine$ZMachine$Memory$wordLength,
							col,
							A3($techbelly$elm_zmachine$ZMachine$Memory$writeWord, arg0, row, m.memory));
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							_Utils_update(
								m,
								{memory: mem}));
					case 'SetTextStyle':
						var _v92 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$appendOutput,
								$techbelly$elm_zmachine$ZMachine$Types$SetTextStyle(arg0),
								m));
					case 'BufferMode':
						var _v93 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(
							A2(
								$techbelly$elm_zmachine$ZMachine$State$appendOutput,
								$techbelly$elm_zmachine$ZMachine$Types$SetBufferMode(!(!arg0)),
								m));
					case 'ReadChar':
						var _v94 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$NeedChar(
							_Utils_update(
								m,
								{pc: machine.pc}));
					case 'ScanTable':
						var _v95 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeScanTable, instr, ops, m);
					case 'NotV5':
						var _v96 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, (~arg0) & 65535, m);
					case 'CallVn':
						var _v97 = _v0.a;
						return A4(
							$techbelly$elm_zmachine$ZMachine$Execute$executeCall,
							instr,
							arg0,
							A2($elm$core$List$drop, 1, ops),
							m);
					case 'CallVn2':
						var _v98 = _v0.a;
						return A4(
							$techbelly$elm_zmachine$ZMachine$Execute$executeCall,
							instr,
							arg0,
							A2($elm$core$List$drop, 1, ops),
							m);
					case 'Tokenise':
						var _v99 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeTokenise, ops, m);
					case 'EncodeText':
						var _v100 = _v0.a;
						return $techbelly$elm_zmachine$ZMachine$Execute$Continue(m);
					case 'CopyTable':
						var _v101 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executeCopyTable, ops, m);
					case 'PrintTable':
						var _v102 = _v0.a;
						return A2($techbelly$elm_zmachine$ZMachine$Execute$executePrintTable, ops, m);
					case 'CheckArgCount':
						var _v103 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeCheckArgCount, instr, ops, m);
					default:
						var n = _v0.a.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$Error,
							$techbelly$elm_zmachine$ZMachine$Types$InvalidOpcode(n),
							m);
				}
			default:
				switch (_v0.a.$) {
					case 'ExtSave':
						var _v104 = _v0.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$executeSave,
							instr,
							_Utils_update(
								m,
								{pc: machine.pc}));
					case 'ExtRestore':
						var _v105 = _v0.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$executeRestore,
							instr,
							_Utils_update(
								m,
								{pc: machine.pc}));
					case 'LogShift':
						var _v106 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeLogShift, instr, ops, m);
					case 'ArtShift':
						var _v107 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$executeArtShift, instr, ops, m);
					case 'SetFont':
						var _v108 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, 1, m);
					case 'SaveUndo':
						var _v109 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, 65535, m);
					case 'RestoreUndo':
						var _v110 = _v0.a;
						return A3($techbelly$elm_zmachine$ZMachine$Execute$storeResult, instr, 0, m);
					default:
						var n = _v0.a.a;
						return A2(
							$techbelly$elm_zmachine$ZMachine$Execute$Error,
							$techbelly$elm_zmachine$ZMachine$Types$InvalidOpcode(n),
							m);
				}
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$resolveOperand = F2(
	function (operand, machine) {
		switch (operand.$) {
			case 'LargeConstant':
				var n = operand.a;
				return _Utils_Tuple2(n, machine);
			case 'SmallConstant':
				var n = operand.a;
				return _Utils_Tuple2(n, machine);
			default:
				var ref = operand.a;
				return A2($techbelly$elm_zmachine$ZMachine$State$readVariable, ref, machine);
		}
	});
var $techbelly$elm_zmachine$ZMachine$Execute$resolveOperands = F2(
	function (operands, machine) {
		var _v0 = A3(
			$elm$core$List$foldl,
			F2(
				function (op, _v1) {
					var acc = _v1.a;
					var m = _v1.b;
					var _v2 = A2($techbelly$elm_zmachine$ZMachine$Execute$resolveOperand, op, m);
					var val = _v2.a;
					var m2 = _v2.b;
					return _Utils_Tuple2(
						A2($elm$core$List$cons, val, acc),
						m2);
				}),
			_Utils_Tuple2(_List_Nil, machine),
			operands);
		var reversed = _v0.a;
		var finalMachine = _v0.b;
		return _Utils_Tuple2(
			$elm$core$List$reverse(reversed),
			finalMachine);
	});
var $techbelly$elm_zmachine$ZMachine$Execute$step = function (machine) {
	var instr = A2($techbelly$elm_zmachine$ZMachine$Decode$decode, machine.pc, machine.memory);
	var nextPC = machine.pc + instr.length;
	var _v0 = A2($techbelly$elm_zmachine$ZMachine$Execute$resolveOperands, instr.operands, machine);
	var operandValues = _v0.a;
	var machineAfterOperands = _v0.b;
	return A4($techbelly$elm_zmachine$ZMachine$Execute$execute, instr, nextPC, operandValues, machineAfterOperands);
};
var $techbelly$elm_zmachine$ZMachine$Run$runSteps = F2(
	function (n, machine) {
		runSteps:
		while (true) {
			if (n <= 0) {
				return $techbelly$elm_zmachine$ZMachine$Run$drain(
					$techbelly$elm_zmachine$ZMachine$Execute$Continue(machine));
			} else {
				var _v0 = $techbelly$elm_zmachine$ZMachine$Execute$step(machine);
				if (_v0.$ === 'Continue') {
					var next = _v0.a;
					var $temp$n = n - 1,
						$temp$machine = next;
					n = $temp$n;
					machine = $temp$machine;
					continue runSteps;
				} else {
					var other = _v0;
					return $techbelly$elm_zmachine$ZMachine$Run$drain(other);
				}
			}
		}
	});
var $techbelly$elm_zmachine$ZMachine$runSteps = $techbelly$elm_zmachine$ZMachine$Run$runSteps;
var $techbelly$elm_zengine$ZEngine$stepBudget = 100000;
var $techbelly$elm_zengine$ZEngine$update = F3(
	function (tagger, msg, _v0) {
		var state = _v0.a;
		return A2(
			$techbelly$elm_zengine$ZEngine$mapStep,
			tagger,
			function () {
				if (msg.$ === 'Yielded') {
					return A2(
						$techbelly$elm_zengine$ZEngine$dispatch,
						A2($techbelly$elm_zmachine$ZMachine$runSteps, $techbelly$elm_zengine$ZEngine$stepBudget, state.machine),
						state);
				} else {
					var result = msg.a;
					return A2($techbelly$elm_zengine$ZEngine$dispatch, result, state);
				}
			}());
	});
var $author$project$Main$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 'OpenClicked':
				return _Utils_Tuple2(
					model,
					A2($elm$file$File$Select$file, _List_Nil, $author$project$Main$FileChosen));
			case 'FileChosen':
				var file = msg.a;
				return _Utils_Tuple2(
					model,
					A2(
						$elm$core$Task$perform,
						$author$project$Main$BytesLoaded,
						$elm$file$File$toBytes(file)));
			case 'BytesLoaded':
				var bytes = msg.a;
				return A3(
					$techbelly$elm_zengine$ZEngine$apply,
					$author$project$Main$mergeEngine,
					_Utils_update(
						model,
						{error: $elm$core$Maybe$Nothing}),
					A3($techbelly$elm_zengine$ZEngine$new, $author$project$Main$EngineMsg, $techbelly$elm_zengine$ZEngine$defaultConfig, bytes));
			case 'EngineMsg':
				var engineMsg = msg.a;
				var _v1 = model.session;
				if (_v1.$ === 'Just') {
					var session = _v1.a;
					return A3(
						$techbelly$elm_zengine$ZEngine$apply,
						$author$project$Main$mergeEngine,
						model,
						A3($techbelly$elm_zengine$ZEngine$update, $author$project$Main$EngineMsg, engineMsg, session));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
			case 'InputChanged':
				var s = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{input: s}),
					$elm$core$Platform$Cmd$none);
			default:
				var _v2 = model.session;
				if (_v2.$ === 'Just') {
					var session = _v2.a;
					return $elm$core$String$isEmpty(
						$elm$core$String$trim(model.input)) ? _Utils_Tuple2(model, $elm$core$Platform$Cmd$none) : A3(
						$techbelly$elm_zengine$ZEngine$apply,
						$author$project$Main$mergeEngine,
						_Utils_update(
							model,
							{input: ''}),
						A3($techbelly$elm_zengine$ZEngine$sendLine, $author$project$Main$EngineMsg, model.input, session));
				} else {
					return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
				}
		}
	});
var $elm$html$Html$div = _VirtualDom_node('div');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$OpenClicked = {$: 'OpenClicked'};
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $elm$html$Html$span = _VirtualDom_node('span');
var $techbelly$elm_zengine$ZEngine$storyName = function (_v0) {
	var state = _v0.a;
	return state.storyName;
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $techbelly$elm_zengine$ZEngine$statusLine = function (_v0) {
	var state = _v0.a;
	return A2($elm$core$Maybe$map, $techbelly$elm_zengine$ZEngine$toPublicStatusLine, state.currentStatusLine);
};
var $author$project$Main$viewStatus = function (session) {
	var _v0 = $techbelly$elm_zengine$ZEngine$statusLine(session);
	if (_v0.$ === 'Just') {
		var status = _v0.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'color', '#666')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('[' + (status.locationName + ']'))
				]));
	} else {
		return $elm$html$Html$text('');
	}
};
var $author$project$Main$viewHeader = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'margin-bottom', '1em')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick($author$project$Main$OpenClicked)
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Open .z3 story\u2026')
					])),
				function () {
				var _v0 = model.session;
				if (_v0.$ === 'Just') {
					var session = _v0.a;
					return A2(
						$elm$html$Html$span,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'margin-left', '1em')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(
								$techbelly$elm_zengine$ZEngine$storyName(session)),
								$elm$html$Html$text('  '),
								$author$project$Main$viewStatus(session)
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}(),
				function () {
				var _v1 = model.error;
				if (_v1.$ === 'Just') {
					var err = _v1.a;
					return A2(
						$elm$html$Html$p,
						_List_fromArray(
							[
								A2($elm$html$Html$Attributes$style, 'color', 'crimson')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text(err)
							]));
				} else {
					return $elm$html$Html$text('');
				}
			}()
			]));
};
var $author$project$Main$InputChanged = function (a) {
	return {$: 'InputChanged', a: a};
};
var $author$project$Main$Submit = {$: 'Submit'};
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$autofocus = $elm$html$Html$Attributes$boolProperty('autofocus');
var $elm$html$Html$Attributes$disabled = $elm$html$Html$Attributes$boolProperty('disabled');
var $elm$html$Html$form = _VirtualDom_node('form');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Events$alwaysPreventDefault = function (msg) {
	return _Utils_Tuple2(msg, true);
};
var $elm$virtual_dom$VirtualDom$MayPreventDefault = function (a) {
	return {$: 'MayPreventDefault', a: a};
};
var $elm$html$Html$Events$preventDefaultOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayPreventDefault(decoder));
	});
var $elm$html$Html$Events$onSubmit = function (msg) {
	return A2(
		$elm$html$Html$Events$preventDefaultOn,
		'submit',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysPreventDefault,
			$elm$json$Json$Decode$succeed(msg)));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$viewPrompt = function (model) {
	return A2(
		$elm$html$Html$form,
		_List_fromArray(
			[
				$elm$html$Html$Events$onSubmit($author$project$Main$Submit),
				A2($elm$html$Html$Attributes$style, 'margin-top', '1em')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$span,
				_List_fromArray(
					[
						A2($elm$html$Html$Attributes$style, 'margin-right', '0.5em')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('>')
					])),
				A2(
				$elm$html$Html$input,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$value(model.input),
						$elm$html$Html$Events$onInput($author$project$Main$InputChanged),
						$elm$html$Html$Attributes$disabled(
						_Utils_eq(model.session, $elm$core$Maybe$Nothing)),
						$elm$html$Html$Attributes$autofocus(true),
						$elm$html$Html$Attributes$placeholder('Type command\u2026'),
						A2($elm$html$Html$Attributes$style, 'width', '30em'),
						A2($elm$html$Html$Attributes$style, 'font-family', 'monospace')
					]),
				_List_Nil)
			]));
};
var $elm$html$Html$pre = _VirtualDom_node('pre');
var $techbelly$elm_zengine$ZEngine$transcript = function (_v0) {
	var state = _v0.a;
	return A2($elm$core$List$map, $techbelly$elm_zengine$ZEngine$toPublicFrame, state.transcript);
};
var $author$project$Main$viewFrame = function (frame) {
	if (frame.$ === 'OutputFrame') {
		var data = frame.a;
		return $elm$html$Html$text(data.text);
	} else {
		var data = frame.a;
		return A2(
			$elm$html$Html$span,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'color', '#06c')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('\n> ' + (data.command + '\n'))
				]));
	}
};
var $author$project$Main$viewTranscript = function (model) {
	var _v0 = model.session;
	if (_v0.$ === 'Just') {
		var session = _v0.a;
		return A2(
			$elm$html$Html$pre,
			_List_fromArray(
				[
					A2($elm$html$Html$Attributes$style, 'white-space', 'pre-wrap'),
					A2($elm$html$Html$Attributes$style, 'line-height', '1.4')
				]),
			A2(
				$elm$core$List$map,
				$author$project$Main$viewFrame,
				$techbelly$elm_zengine$ZEngine$transcript(session)));
	} else {
		return A2(
			$elm$html$Html$p,
			_List_Nil,
			_List_fromArray(
				[
					$elm$html$Html$text('Load a .z3 story to begin.')
				]));
	}
};
var $author$project$Main$view = function (model) {
	return A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				A2($elm$html$Html$Attributes$style, 'font-family', 'monospace'),
				A2($elm$html$Html$Attributes$style, 'max-width', '48em'),
				A2($elm$html$Html$Attributes$style, 'margin', '2em auto'),
				A2($elm$html$Html$Attributes$style, 'padding', '0 1em')
			]),
		_List_fromArray(
			[
				$author$project$Main$viewHeader(model),
				$author$project$Main$viewTranscript(model),
				$author$project$Main$viewPrompt(model)
			]));
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: function (_v0) {
			return _Utils_Tuple2(
				{error: $elm$core$Maybe$Nothing, input: '', session: $elm$core$Maybe$Nothing},
				$elm$core$Platform$Cmd$none);
		},
		subscriptions: function (_v1) {
			return $elm$core$Platform$Sub$none;
		},
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(_Utils_Tuple0))(0)}});}(this));