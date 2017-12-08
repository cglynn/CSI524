/* DES encryption and Decryption JavaScript file */


// 'some random string' -> 736f6d652072616e646f6d20737472696e67
function string2Hex(str){
	var result = '';
	for(i=0;i<str.length;i++)
	{
		hex = str.charCodeAt(i).toString(16);
		result += (hex).slice(-4);
	}
	return result;
}

// 'some random string' -> 011100110110111101101101011001010010000001110010011000010110111001100100011011110110110100100000011100110111010001110010011010010110111001100111
function string2Bin(str){
	var result = '';
	for(i=0;i<str.length;i++)
	{
		result += ("0000"+(str[i].charCodeAt(0).toString(2))).slice(-8) + " ";
	}
	return result;
}

// '736f6d652072616e646f6d20737472696e67' -> 011100110110111101101101011001010010000001110010011000010110111001100100011011110110110100100000011100110111010001110010011010010110111001100111
function hex2Bin(str){
	var result = '';
	for(i=0;i<str.length;i++)
	{
		result += ("0000" + (parseInt(str[i], 16)).toString(2)).slice(-4);
	}
	
	return result;
}

//011100110110111101101101011001010010000001110010011000010110111001100100011011110110110100100000011100110111010001110010011010010110111001100111 -> 736f6d652072616e646f6d20737472696e67
function bin2Hex(str){
	var result = '';
	for(i=0;i<str.length;i+=4)
	{
		result += parseInt(str.substring(i,i+4), 2).toString(16);
	}
	return result;
}

// '736f6d652072616e646f6d20737472696e67' -> some random string
function hex2String(str)
{
	var result = '';
    for (i = 0; i < str.length; i += 2) {
      result += String.fromCharCode(parseInt(str.substr(i, 2), 16));
    }
    return result;
}

//011100110110111101101101011001010010000001110010011000010110111001100100011011110110110100100000011100110111010001110010011010010110111001100111 -> some random string
function bin2String(str)
{
	var result = '';
	for (i=0;i<str.length;i+=8)
	{
		result += String.fromCharCode(parseInt(str.substring(i, 8), 2));
	}
	return result;
}

//pad zeros if the message is shorter than 64 bits.
function padString(str)
{
	var result = str;
	for(i=0;i<64-str.length;i++)
	{
		result += '0';
	}
	return result;
}

//does transposition and chooses 56 bits out of 64 bits.
function permutedChoice1(str)
{
	var pc1 = [57, 49, 41, 33, 25, 17, 9,
               1, 58, 50, 42, 34, 26, 18,
              10, 2, 59, 51, 43, 35, 27,
              19, 11,  3, 60, 52, 44, 36,
              63, 55, 47, 39, 31, 23, 15,
               7, 62, 54, 46, 38, 30, 22,
              14, 6, 61, 53, 45, 37, 29,
              21, 13, 5, 28, 20, 12, 4];
	var result = '';		  
	for(i=0;i<pc1.length;i++)
	{
		result += str[pc1[i]-1];
	}
	
	return result;
}

//does a left circular shift on any given input.
function leftCircularShift(str, numberOfShifts)
{
	var shiftbit = str.substring(0, numberOfShifts);
	var remainingPart = str.substring(numberOfShifts, str.length);
	var result = remainingPart + shiftbit;
	return result;
}

//does transposition and chooses 48 bits takes 56 bits as input.
function permutedChoice2(str)
{
	var pc2 = [  14, 17, 11, 24,  1,  5,
                  3, 28, 15,  6, 21, 10,
                 23, 19, 12,  4, 26,  8,
                 16,  7, 27, 20, 13,  2,
                 41, 52, 31, 37, 47, 55,
                 30, 40, 51, 45, 33, 48,
                 44, 49, 39, 56, 34, 53,
                 46, 42, 50, 36, 29, 32];
	
	var result = '';
	for(i=0;i<pc2.length;i++)
	{
		result += str[pc2[i]-1];
	}
	
	return result;
}

//returns number of left shifts needed for each iteration
function iterationLeftShift(){
	var leftshifts = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];
	return leftshifts;
}

//provide 56 bit pc1 input. provides a set of keys for each iteration.
function getAllKeys(key)
{
	var k = [0];
	var permChoice1 = [key];
	var leftshifts = iterationLeftShift();
	for(var i=1;i<=16;i++)
	{
		var part1Key = permChoice1[i-1].substring(0, (permChoice1[i-1].length/2));
		var part2Key = permChoice1[i-1].substring((permChoice1[i-1].length/2), permChoice1[i-1].length);
		
		var currentPermChoice1Part1 = leftCircularShift(part1Key, leftshifts[i-1]);
		var currentPermChoice1Part2 = leftCircularShift(part2Key, leftshifts[i-1]);
		
		var currentPermChoice1 = currentPermChoice1Part1 + currentPermChoice1Part2;
		
		var currentKey = permutedChoice2(currentPermChoice1);
		
		permChoice1.push(currentPermChoice1);
		k.push(currentKey);
	}
	return k;
}

// Does the initial permutation of the 64-bit plain text.
function initialPermutaion(message)
{
	var ip = [ 58, 50, 42, 34, 26, 18, 10, 2,
            60, 52, 44, 36, 28, 20, 12, 4,
            62, 54, 46, 38, 30, 22, 14, 6,
            64, 56, 48, 40, 32, 24, 16, 8,
            57, 49, 41, 33, 25, 17,  9, 1,
            59, 51, 43, 35, 27, 19, 11, 3,
            61, 53, 45, 37, 29, 21, 13, 5,
            63, 55, 47, 39, 31, 23, 15, 7 ];
	
	var result = '';
	for(var i = 0; i < ip.length; i++)
	{
		result += message[ip[i]-1];
	}
	return result;
}

//Expands the 32-bit message on the right to 48-bits.
function expansionFunction(str)
{
	var expansionTable = [
		         32,  1,  2,  3,  4,  5,
                  4,  5,  6,  7,  8,  9,
                  8,  9, 10, 11, 12, 13,
                 12, 13, 14, 15, 16, 17,
                 16, 17, 18, 19, 20, 21,
                 20, 21, 22, 23, 24, 25,
                 24, 25, 26, 27, 28, 29,
                 28, 29, 30, 31, 32,  1
	];
	
	var result = '';
	for(var i = 0; i < expansionTable.length; i++)
	{
		result += str[expansionTable[i]-1];
	}
	return result;
}

//does xor of key and exanded right.
function XOR(key , expandedRight)
{
	//XOR not available in javascript.
	//layman implementation.
	result = '';
	for(var i=0; i<key.length;i++)
	{
		if(key[i] == expandedRight[i])
		{
			result += '0';
		}
		else
		{
			result += '1';
		}
	}
	return result;

}


//uses the sboxes to calculate the 32-bit output from 48-bit input.
function fFunction(str)
{
	sBox = [
	  //S1
	[[14,  4, 13, 1,  2, 15, 11,  8,  3, 10,  6, 12,  5,  9, 0,  7],
     [ 0, 15,  7, 4, 14,  2, 13,  1, 10,  6, 12, 11,  9,  5, 3,  8],
     [ 4,  1, 14, 8, 13,  6,  2, 11, 15, 12,  9,  7,  3, 10, 5,  0],
     [15, 12,  8, 2,  4,  9,  1,  7,  5, 11,  3, 14, 10,  0, 6, 13] ],
	  //S2
	[[15,  1,  8, 14,  6, 11,  3,  4,  9, 7,  2, 13, 12, 0,  5, 10],
     [ 3, 13,  4,  7, 15,  2,  8, 14, 12, 0,  1, 10,  6, 9, 11,  5],
     [ 0, 14,  7, 11, 10,  4, 13,  1,  5, 8, 12,  6,  9, 3,  2, 15],
     [13,  8, 10,  1,  3, 15,  4,  2, 11, 6,  7, 12,  0, 5, 14,  9] ],
	  //S3	 
	[[10,  0,  9, 14, 6,  3, 15,  5,  1, 13, 12,  7, 11,  4,  2,  8],
     [13,  7,  0, 9,  3,  4,  6, 10,  2,  8,  5, 14, 12, 11, 15,  1],
     [13,  6,  4, 9,  8, 15,  3,  0, 11,  1,  2, 12,  5, 10, 14,  7],
     [ 1, 10, 13, 0,  6,  9,  8,  7,  4, 15, 14,  3, 11,  5,  2, 12] ],
	  //S4	     
	[[ 7, 13, 14, 3,  0,  6,  9, 10,  1,  2,  8,  5, 11, 12,  4, 15],
     [13,  8, 11, 5,  6, 15,  0,  3,  4,  7,  2, 12,  1, 10, 14,  9],
     [10,  6,  9, 0, 12, 11,  7, 13, 15,  1,  3, 14,  5,  2,  8,  4],
     [ 3, 15,  0, 6, 10,  1, 13,  8,  9,  4,  5, 11, 12,  7,  2, 14] ],
	  //S5	 
	[[ 2, 12,  4, 1,  7, 10, 11,  6,  8,  5,  3, 15, 13,  0, 14,  9],
     [14, 11,  2, 12, 4,  7, 13,  1,  5,  0, 15, 10,  3,  9,  8,  6],
     [ 4,  2,  1, 11, 10, 13, 7,  8, 15,  9, 12,  5,  6,  3,  0, 14],
     [11,  8, 12, 7,  1, 14,  2, 13,  6, 15,  0,  9, 10,  4,  5,  3] ],
	  //S6	  
	[[12,  1, 10, 15, 9,  2,  6,  8,  0, 13,  3,  4, 14,  7,  5, 11],
     [10, 15,  4, 2,  7, 12,  9,  5,  6,  1, 13, 14,  0, 11,  3,  8],
     [ 9, 14, 15, 5,  2,  8, 12,  3,  7,  0,  4, 10,  1, 13, 11,  6],
     [ 4,  3,  2, 12, 9,  5, 15, 10, 11, 14,  1,  7,  6,  0,  8, 13] ],
	  //S7	    
	[[ 4, 11,  2, 14, 15,  0,  8, 13,  3, 12,  9,  7,  5, 10,  6,  1],
     [13,  0, 11, 7,   4,  9,  1, 10, 14,  3,  5, 12,  2, 15,  8,  6],
     [ 1,  4, 11, 13, 12,  3,  7, 14, 10, 15,  6,  8,  0,  5,  9,  2],
     [ 6, 11, 13, 8,   1,  4, 10,  7,  9,  5,  0, 15, 14,  2,  3, 12] ],
	  //S8	 
	[[13,  2,  8, 4,  6, 15, 11,  1, 10,  9,  3, 14,  5,  0, 12,  7],
     [ 1, 15, 13, 8, 10,  3,  7,  4, 12,  5,  6, 11,  0, 14,  9,  2],
     [ 7, 11,  4, 1,  9, 12, 14,  2,  0,  6, 10, 13, 15,  3,  5,  8],
     [ 2,  1, 14, 7,  4, 10,  8, 13, 15, 12,  9,  0,  3,  5,  6, 11] ],
	];
	result = '';
	for(var i=0;i<sBox.length;i++)
	{
		var currentBlock = str.substring(i*6, (i*6)+6);
		var rowNo = parseInt(currentBlock[0] + currentBlock[currentBlock.length-1], 2).toString(10);
		var colNo = parseInt(currentBlock.substring(1, 5), 2).toString(10);
		var temp = sBox[i][rowNo][colNo];
		result += ('0000' + (+temp).toString(2)).slice(-4);
	}
	return result;
}

//final permutation in the fFunction.
function finalFCalculation(str)
{
	var p = [
			 16,  7, 20, 21,
			 29, 12, 28, 17,
			  1, 15, 23, 26,
			  5, 18, 31, 10,
			  2,  8, 24, 14,
			 32, 27,  3,  9,
			 19, 13, 30,  6,
			 22, 11,  4, 25
	];
	
	var result = '';
	for(var i=0; i<p.length;i++)
	{
		result += str[p[i]-1];
	}
	return result;
}

//Final permutation of the whole encryption process.(Inverse Initial Permutation)
function invInitPerm(str)
{
	var ipInv = [
		    40, 8, 48, 16, 56, 24, 64, 32,
            39, 7, 47, 15, 55, 23, 63, 31,
            38, 6, 46, 14, 54, 22, 62, 30,
            37, 5, 45, 13, 53, 21, 61, 29,
            36, 4, 44, 12, 52, 20, 60, 28,
            35, 3, 43, 11, 51, 19, 59, 27,
            34, 2, 42, 10, 50, 18, 58, 26,
            33, 1, 41,  9, 49, 17, 57, 25];
			
	var result = '';
	for(var i=0;i<ipInv.length;i++)
	{
		result += str[ipInv[i]-1];
	}
	
	return result;
}


//implementation.
var strmes = 'ChriS';

var hexstr = string2Hex(strmes);

var messageBin = hex2Bin(hexstr);

if(messageBin.length>64)
{
	messageBin = messageBin.substring(0, 64);
}
else if(messageBin.length<64)
{
	messageBin = padString(messageBin);
}

var m = '0000000000000000';//hexadecimal value
var key = '22234512987ABB23';//hexadecimal value

//var binM = hex2Bin(m);
var binM = messageBin;
var binKey = hex2Bin(key);

var permcho1 = permutedChoice1(binKey);

var keys = getAllKeys(permcho1);

//console.log(keys);

var initialPerm = initialPermutaion(binM);

var L = [];
var R = [];
L.push(initialPerm.substring(0, initialPerm.length/2));
R.push(initialPerm.substring(initialPerm.length/2, initialPerm.length));

for(var ij=1;ij<=16;ij++)
{
	var prevR = R[ij-1];
	L.push(prevR);
	console.log( 'L' + ij + ': ' + bin2Hex(L[ij]));
	var expandedR = expansionFunction(prevR);
	var xorwithkey = XOR(keys[ij], expandedR);
	var sboxprocess = fFunction(xorwithkey);
	var fValue = finalFCalculation(sboxprocess);
	var currentR = XOR(L[ij-1], fValue);
	R.push(currentR);
	console.log('R' + ij + ': ' +bin2Hex(R[ij]));
}

	var revTwoBlocks = R[R.length-1] + L[L.length-1];
	
	var finalBin = invInitPerm(revTwoBlocks);
	
	var finalHex = bin2Hex(finalBin);
	console.log(finalHex);
	
	
var dinitialPerm = initialPermutaion(finalBin);

var dL = [];
var dR = [];
dL.push(dinitialPerm.substring(0, dinitialPerm.length/2));
dR.push(dinitialPerm.substring(dinitialPerm.length/2, dinitialPerm.length));	

var revKeys = keys;
revKeys.reverse();
revKeys.unshift(0);
//console.log(revKeys);
for(var k =1; k<=16; k++)
{
	var dprevR = dR[k-1];
	dL.push(dprevR);
	console.log( 'L' + k + ': ' + bin2Hex(dL[k]));
	var dexpandedR = expansionFunction(dprevR);
	var dxorwithkey = XOR(revKeys[k], dexpandedR);
	var dsboxprocess = fFunction(dxorwithkey);
	var dfValue = finalFCalculation(dsboxprocess);
	var dcurrentR = XOR(dL[k-1], dfValue);
	dR.push(dcurrentR);
	console.log('R' + k + ': ' +bin2Hex(dR[k]));
}

var drevTwoBlocks = dR[dR.length-1] + dL[dL.length-1];
var originalBin = invInitPerm(drevTwoBlocks);
var originalHex = bin2Hex(originalBin);
console.log(originalHex);
console.log(hex2String(originalHex));



