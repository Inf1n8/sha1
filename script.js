var xor = function (word_1, word_2) {
    var w1 = word_1.split("");
    var w2 = word_2.split("");
    var processed = [];
    for (var i = 0; i < word_1.length || i < word_2.length; i++) {
        if (w1[i] !== w2[i] && (w1[i] === '1' || w2[i] === '1' )) {
            processed.push('1');
        } else {
            processed.push('0');
        }
    }
    return processed.join("");
};
var rotate = function (str, count) {
    if (count === 0) {
        return str;
    }

    var arr = str.split("");
    arr.push(arr.splice(0, 1)[0]);
    return rotate(arr.join(""), count - 1);
};
var or = function (w1, w2) {
    var bits1 = w1.split("");
    var bits2 = w2.split("");
    var processed = [];
    for (var i = 0; i < w1.length || i < w2.length; i++) {
        if (bits1[i] === '1' || bits2[i] === '1') {
            processed.push('1');
        } else {
            processed.push('0');
        }
    }
    return processed.join("");
};
var and = function (w1, w2) {
    var bits1 = w1.split("");
    var bits2 = w2.split("");
    var processed = [];
    for (var i = 0; i < w1.length || i < w2.length; i++) {
        if (bits1[i] === '1' && bits2[i] === '1') {
            processed.push('1');
        } else {
            processed.push('0');
        }
    }
    return processed.join("");
};
var add = function (w1, w2, length) {
    var decimalResult = parseInt(w1, 2) + parseInt(w2, 2);
    var binaryResult = decimalResult.toString(2);

    if (binaryResult.length < length) {
        binaryResult =
            getStringXTime("0", length - binaryResult.length) + binaryResult;
    } else if (binaryResult.length > length) {
        binaryResult = binaryResult.substr(binaryResult.length - length);
    }

    return binaryResult;
};
var not = function (w1) {
    var bits1 = w1.split("");
    var processed = [];
    for (var i = 0; i < w1.length; i++) {
        if (bits1[i] === '0') {
            processed.push('1');
        } else {
            processed.push('0');
        }
    }
    return processed.join("");
};
var binToHex = function (str, length) {
    str = parseInt(str, 2).toString(16);
    if (str.length < 8) {
        str = getStringXTime("0", length - str.length) + str;
    }
    return str;
};
var getStringXTime = function (str, count) {
    // We increment the count as the join only happens between elements.
    return new Array(count + 1).join(str);
};

function SHA1(str) {
    var str_split = str.split("");
    console.log(str_split);
    var str2ascii = str_split.map(function (a) {
        return a.charCodeAt(0);
    });
    var str2bin = str2ascii.map(function (a) {
        return a.toString(2);
    });
    console.log(str2ascii, str2bin);
    var str_padded = str2bin.map(function (a) {
        var b = '';
        for (i = 0; i < 8 - a.length; i++) {
            b += '0';
        }
        b += a;
        return (b);
    });
    console.log(str_padded);
    var str_combine = str_padded.join("");
    console.log(str_combine);
    var str_append_1 = str_combine + '1';
    console.log(str_append_1);
    var str_modulo_512_is_448 = (function (str) {
        var currentModulo = str.length % 512;

        if (currentModulo < 448) {
            // If in the range 0-447 we just need to append `448-currentModulo` zeros.
            for (i = 0; i < 448 - currentModulo; i++) {
                str += '0';
            }
        } else if (currentModulo > 448) {
            // If in the range 449-511 we need to append `512-currentModule + 448` zeros.
            for (i = 0; i < 512 - currentModulo + 448; i++) {
                str += '0';
            }
        }
        //padding with 64 bits of message length


        return str;
    })(str_append_1);
    console.log(str_modulo_512_is_448);
    //Finding the length of message and converting into binary
    var message_length = str_combine.length.toString(2);
    var b = '';
    for (var i = 0; i < 64 - message_length.length; i++) {
        b += '0';
    }
    //Message length of 64 bits is generated
    b += message_length;
    str_modulo_512_is_448 += b;
    console.log(str_modulo_512_is_448);
    // Step 9: Split into 512 long chunks.
    var str_512b_chunks = (function (str) {
        var chunks = [];
        while (str.length > 0) {
            chunks.push(str.substr(0, 512));
            str = str.substr(512);
        }
        return chunks;
    })(str_modulo_512_is_448);
    console.log(str_512b_chunks);
    //Split each chunks into 32bits words
    var str_32b_words = str_512b_chunks.map(function (chunk) {
        var words = [];
        while (chunk.length > 0) {
            words.push(chunk.substr(0, 32));
            chunk = chunk.substr(32);
        }
        return words;
    });
    console.log(str_32b_words);
    // Step 11: Generate words to get 80 Words per chunk instead of 16.
    var step11_80_words_per_chunk = (function (chunks) {
        // For each chunks
        for (var i = 0; i < chunks.length; i++) {
            var words = chunks[i];
            // Generate new words until words.length === 80
            for (var j = 16; words.length < 80; j++) {
                // We XOR 4 words together to generate a new one.
                // We start at index 16 and use j-3 XOR j-8 XOR j-14 XOR j-16
                var tmp = xor(words[j - 3], words[j - 8]);
                tmp = xor(tmp, words[j - 14]);
                tmp = xor(tmp, words[j - 16]);

                // Finally we rotate the new word
                tmp = rotate(tmp, 1);
                words.push(tmp);
            }
        }

        return chunks;
    })(str_32b_words);
    console.log(step11_80_words_per_chunk);
    // Step 12: Variable that will serve as base for the hashing algorithm.
    var h0 = '01100111010001010010001100000001'; // 0x67452301
    var h1 = '11101111110011011010101110001001'; // 0xEFCDAB89
    var h2 = '10011000101110101101110011111110'; // 0x98BADCFE
    var h3 = '00010000001100100101010001110110'; // 0x10325476
    var h4 = '11000011110100101110000111110000'; // 0xC3D2E1F0
    step11_80_words_per_chunk.forEach(function (words) {
        var a = h0;
        var b = h1;
        var c = h2;
        var d = h3;
        var e = h4;

        // For each Chunk we process the 80 words
        for (var i = 0; i < 80; i++) {
            if (i < 20) {
                // f = (b and c) or ((not b) and d)
                var f =
                    or(
                        and(b, c),
                        and(
                            not(b),
                            d
                        )
                    );
                var k = '01011010100000100111100110011001';
            } else if (i < 40) {
                // f = b XOR c XOR d
                f = xor(xor(b, c), d);
                k = '01101110110110011110101110100001'
            } else if (i < 60) {
                // f = (b and c) or (b and d) or (c and d)
                f =
                    xor(
                        xor(
                            and(b, c),
                            and(b, d)
                        ),
                        and(c, d)
                    );
                k = '10001111000110111011110011011100';
            } else {
                // f = b XOR c XOR d
                f = xor(xor(b, c), d);
                k = '11001010011000101100000111010110';
            }

            var tmp = rotate(a, 5);
            tmp = add(tmp, f, 32);
            tmp = add(tmp, e, 32);
            tmp = add(tmp, k, 32);
            tmp = add(tmp, words[i], 32);
            e = d;
            d = c;
            c = rotate(b, 30);
            b = a;
            a = tmp;
        }

        h0 = add(h0, a, 32);
        h1 = add(h1, b, 32);
        h2 = add(h2, c, 32);
        h3 = add(h3, d, 32);
        h4 = add(h4, e, 32);
    });

    // Step 14: We reduce the 5 remaining strings by concatenating their hexadecimal
    // values.
    // Depending on the tool / platform, a SHA1 may also be given as a BASE64 ASCII
    // string.
    var hash1= binToHex(h0, 8) + binToHex(h1, 8) + binToHex(h2, 8) + binToHex(h3, 8) + binToHex(h4, 8);
    // console.log(hash1);
    console.log('clicked1');
    return(hash1);
}


// console.log(SHA1('helloworldthisisvikramevasudevandilovethisworldhelloworldthisisvikramevasudevandilovethisworld'));
document.getElementById("btn").onclick=function()
{
  var str1=document.getElementById("string").value;
  var hash=SHA1(str1);
  console.log(hash);
  document.getElementById("hashed").value=hash;
};