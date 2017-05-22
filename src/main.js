/**
 * Created by amccollough on 5/22/17.
 */

export function configure(aurelia) {
    aurelia.use
        .basicConfiguration()
        .developmentLogging();
    aurelia.start ().then (() => aurelia.setRoot ());
}
