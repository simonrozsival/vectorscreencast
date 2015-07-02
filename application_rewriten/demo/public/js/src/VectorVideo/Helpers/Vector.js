var Helpers;
(function (Helpers) {
    /**
     * Immutable two dimensional vector representation with basic operations.
     * @author  Šimon Rozsíval
     */
    var Vector2 = (function () {
        function Vector2(x, y) {
            this.x = x;
            this.y = y;
            this.size = -1;
            this.sizeSq = -1;
        }
        Object.defineProperty(Vector2.prototype, "X", {
            /**
             * X coord
             */
            get: function () { return this.x; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Vector2.prototype, "Y", {
            /**
             * Y coord
             */
            get: function () { return this.y; },
            enumerable: true,
            configurable: true
        });
        /**
         * Compare two vectors
         */
        Vector2.prototype.isEqualTo = function (b) {
            return this.X === b.X && this.Y === b.Y;
        };
        /**
         * Calculates size of the vector.
         */
        Vector2.prototype.getSize = function () {
            if (this.size < 0) {
                this.size = Math.sqrt(this.getSizeSq());
            }
            return this.size;
        };
        ;
        /**
         * Calculates squared size of the vector.
         */
        Vector2.prototype.getSizeSq = function () {
            if (this.sizeSq < 0) {
                this.sizeSq = this.x * this.x + this.y * this.y;
            }
            return this.sizeSq;
        };
        /**
         * Distance between this and the other point.
         */
        Vector2.prototype.distanceTo = function (b) {
            return this.subtract(b).getSize();
        };
        ;
        /**
         * Normalizes the vector.
         * @throws Error
         */
        Vector2.prototype.normalize = function () {
            var size = this.getSize();
            if (size === 0) {
                throw new Error("Can't normalize zero vector.");
            }
            return this.scale(1 / size);
        };
        ;
        /**
         * Creates a normal vector to this vector.
         */
        Vector2.prototype.getNormal = function () {
            return new Vector2(-this.y, this.x).normalize();
        };
        ;
        /**
         * Create a new two-dimensional vector as a combination of this vector with a specified vector.
         */
        Vector2.prototype.add = function (b) {
            return new Vector2(this.x + b.X, this.y + b.Y);
        };
        ;
        /**
         * Create a new two-dimensional vector by subtracting a specified vector from this vector.
         */
        Vector2.prototype.subtract = function (b) {
            return new Vector2(this.x - b.X, this.y - b.Y);
        };
        ;
        /**
         * Create a new vector that is scaled by the coeficient c.
         */
        Vector2.prototype.scale = function (c) {
            return new Vector2(this.x * c, this.y * c);
        };
        ;
        /**
         * Make a copy of the vector.
         */
        Vector2.prototype.clone = function () {
            return new Vector2(this.x, this.y);
        };
        ;
        return Vector2;
    })();
    Helpers.Vector2 = Vector2;
})(Helpers || (Helpers = {}));