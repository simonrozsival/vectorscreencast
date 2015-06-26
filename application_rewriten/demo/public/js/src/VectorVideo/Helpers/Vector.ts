module Helpers {
    
    /**
     * Immutable two dimensional vector representation with basic operations.     
     * @author  Šimon Rozsíval
     */
    export class Vector2 {
    
        /**
         * X coord
         */
        get X() : number { return this.x; }
        
        /**
         * Y coord
         */
        get Y() : number { return this.y; }
    
        constructor(private x: number, private y: number) {
            this.size = -1;
            this.sizeSq = -1;
        }
    
        /**
         * Compare two vectors 
         */
        isEqualTo(b: Vector2) : boolean {
            return this.X === b.X && this.Y === b.Y;
        }
    
        private size: number;
    
        /**
         * Calculates size of the vector.
         */
        getSize() : number {
            if(this.size < 0) {
                this.size = Math.sqrt(this.getSizeSq());
            }
            return this.size;
        };
                
        private sizeSq: number;
                
        /**
         * Calculates squared size of the vector.
         */
        getSizeSq() : number {
            if(this.sizeSq < 0) {
                this.sizeSq = this.x*this.x + this.y*this.y;
            }
            
            return this.sizeSq;
        }
    
        /**
         * Distance between this and the other point.
         */
        distanceTo(b: Vector2) : number {
            return this.subtract(b).getSize();
        };
    
        /**
         * Normalizes the vector.
         * @throws Error
         */
        normalize() : Vector2 {
            var size: number = this.getSize();
            if(size === 0) {
                throw new Error("Can't normalize zero vector.");
            }
    
            return this.scale(1/size);
        };
    
        /**
         * Creates a normal vector to this vector.
         */
        getNormal() : Vector2 {
            return new Vector2(-this.y, this.x).normalize();
        };
    
        /**
         * Create a new two-dimensional vector as a combination of this vector with a specified vector.
         */
        add(b: Vector2) : Vector2 {
            return new Vector2(this.x + b.X, this.y + b.Y);
        };
    
        /**
         * Create a new two-dimensional vector by subtracting a specified vector from this vector.
         */
        subtract(b: Vector2) : Vector2 {
            return new Vector2(this.x - b.X, this.y - b.Y);
        };
    
        /**
         * Create a new vector that is scaled by the coeficient c.
         */
        scale(c: number) : Vector2 {
            return new Vector2(this.x * c, this.y * c);
        };
    
        /**
         * Make a copy of the vector.
         */
        clone() : Vector2 {
            return new Vector2(this.x, this.y);
        };
    }
}