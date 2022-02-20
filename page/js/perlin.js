/*
 * Perlin noise courtesy of d2fn - Daniel Featherston - https://gist.github.com/d2fn/0d3789278f3d9816e0fd
 * 'Curves drawn by randomly placing actors on the canvas, 
    and walking them in a direction determined by the perlin noise function at their location. 
    The continuity of the underlying noise function causes paths to converge together.'
 *
    * Adapted from Kes Thomas' JavaScript Perlin noise code; found here:
    * http://asserttrue.blogspot.ca/2011/12/perlin-noise-in-javascript_31.html
    * Kes Thomas' JavaScript code is a port of Ken Perlin's original Java code.
    * Original Java code can be found here: http://cs.nyu.edu/%7Eperlin/noise/
    * Note: in this version, Daniel's version below, a number from 0 to 1 is returned.
 */

(function(){
    var permutation = [];

    function scalenum(n) {
        return (1 + n)/2;
    }

    function grad(hash, x, y, z) {
        var h = hash & 15,       // convert lo 4 bits of hash code
            u = h < 8 ? x : y,   // into 12 gradient directions
            v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h&1) == 0 ? u : -u) + ((h&2) == 0 ? v : -v);
    }

    function fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // linear interpolation between a and b by amount t (0, 1)
    function lerp(t, a, b) {
        return a + t * (b - a);
    }

    var noise = function(scale) {
        // build the perm array
        var p = new Array(512)
        for (var i=0; i < 256 ; i++) {
            permutation[i] = Math.floor(Math.random() * 255);
            p[256+i] = p[i] = permutation[i];
        }

        return function(x, y, z) {
            if(!z) z = 0;

            x *= scale;
            y *= scale;
            z *= scale;

            // find unit cube that contains this point
            var X = Math.floor(x) & 255,
                Y = Math.floor(y) & 255,
                Z = Math.floor(z) & 255;

            // find relative x, y, z of point in cube
            x -= Math.floor(x);
            y -= Math.floor(y);
            z -= Math.floor(z);

            // compute the face curves for each of X, Y, Z
            var u = fade(x),
                v = fade(y),
                w = fade(z);

            // hash coordinates of the 8 cube corners
            var A  = p[X  ]+Y,
                AA = p[A  ]+Z,
                AB = p[A+1]+Z,
                B  = p[X+1]+Y,
                BA = p[B  ]+Z,
                BB = p[B+1]+Z;

            var lo =
                lerp(v,
                    lerp(u, grad(p[AA  ], x  , y  , z   ),
                            grad(p[BA  ], x-1, y  , z   )),
                    lerp(u, grad(p[AB  ], x  , y-1, z   ),
                            grad(p[BB  ], x-1, y-1, z   )));

            var hi =
                lerp(v,
                    lerp(u, grad(p[AA+1], x  , y  , z-1 ),
                            grad(p[BA+1], x-1, y  , z-1 )),
                    lerp(u, grad(p[AB+1], x  , y-1, z-1 ),
                            grad(p[BB+1], x-1, y-1, z-1 )));

            // add blended results from 8 corners of cube
            return scalenum(lerp(w, lo, hi));
        }
    };
    window.perlin = {
        noise: noise
    };
})();
