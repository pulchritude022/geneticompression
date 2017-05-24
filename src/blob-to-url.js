/**
 * Created by amccollough on 5/23/17.
 */
export class BlobToUrlValueConverter {
    toView(blob) {
        return URL.createObjectURL(blob);
    }
}
