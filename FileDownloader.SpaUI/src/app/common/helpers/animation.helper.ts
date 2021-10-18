export class AnimationHelper {
    public static getCurrentRotation(element: HTMLElement) : number | void {
        let values: number[];
        const currentRotationMatrix = getComputedStyle(element).transform;

        if(currentRotationMatrix === "none") return;
        
        const regExp = new RegExp(/^[a-z]{6}\(([-?\d+\.?\d]*), ([-?\d+\.?\d]*), ([-?\d+\.?\d]*), ([-?\d+\.?\d]*), ([-?\d+\.?\d]*), ([-?\d+\.?\d]*)\)/, 'i');
        const currentRotation = regExp.exec(currentRotationMatrix);

        if(!currentRotation) {
            return;
        }

        values = [parseFloat(currentRotation[1]), parseFloat(currentRotation[2])];

        return ~~(Math.atan2(values[1], values[0]) * (180/Math.PI)) % 360;
      }
}