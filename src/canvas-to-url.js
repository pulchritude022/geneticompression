/**
 * Created by amccollough on 5/23/17.
 */
export class CanvasToUrlValueConverter {
    toView(canvas) {
        return canvas.toDataURL();
    }
}