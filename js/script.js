function sortSetting(a, b) {
    if (a.breakPoint > b.breakPoint) return -1;
    if (a.breakPoint == b.breakPoint) return 0;
    if (a.breakPoint < b.breakPoint) return 1;
}

class Slider {

    constructor(settingObj) {
        this.settings = settingObj;
        this.prevWindowSize = document.documentElement.clientWidth;

        this.container = document.querySelector(".gallery-container");
        this.containerTranslateX = 0;
        this.container.style.transform = "";

        this.currentSettings = this.settings;

        if (settingObj.breakPoints) {

            this._setBpSettings();
            this._followWindowSizes();

        }

        this._initSlider(this.currentSettings);
        this._initButtons();

    }

    _initButtons() {

        this.nextButton = document.querySelector("#next-slide");
        this.prevButton = document.querySelector("#prev-slide");

        if (this.currentSlideIdx === this.itemsValues - 1) {
            this.nextButton.dataset.slidesToShow = "empty";
        }

        if (this.currentSlideIdx - 1 === 0) {
            this.prevButton.dataset.slidesToShow = "empty";
        }

        this.nextButton.addEventListener("click", () => {

            this.prevButton.dataset.slidesToShow = "";


            if (this.currentSlideIdx < this.itemsValues - 1 && this.isAvailableToSlide) {
                this._changeSlide(true);
            }

            if (this.currentSlideIdx + 1 === this.itemsValues - 1) {
                this.nextButton.dataset.slidesToShow = "empty";
            }

        });

        this.prevButton.addEventListener("click", () => {

            this.nextButton.dataset.slidesToShow = "";

            if (this.currentSlideIdx > 0 && this.isAvailableToSlide) {
                this._changeSlide(false);
            }

            if (this.currentSlideIdx - 1 === 0) {
                this.prevButton.dataset.slidesToShow = "empty";
            }

        });

    }

    _followWindowSizes() {

        window.addEventListener("resize", () => {

            this.containerTranslateX = 0;
            this.container.style.transform = "";
            this._setBpSettings();
        });


    }

    _setBpSettings() {
        const breakpoints = this.settings.breakPoints.sort(sortSetting);
        const currentWindowSize = document.documentElement.clientWidth;
        
        if (breakpoints[0].breakPoint < currentWindowSize) {
            this.currentSettings = this.settings;

        } else {
            breakpoints.forEach(breakpoint => {

                if (breakpoint.breakPoint > currentWindowSize) {
                    this.currentSettings = breakpoint.settings;
                    return;
                }

            });
        }

        this._initSlider(this.currentSettings);

    }

    _initSlider(obj) {

        this._setSizes(obj)
        this.isAvailableToSlide = true;

        this.itemsValues = this.slideImgs.length;
        this.currentSlideIdx = this.itemsValues - 1;

        this.containerTranslateX = 0;
        this.container.style.transform = 0;

        this._activateCurrentSlide();

    }

    _setSizes(obj) {
        this.body = document.querySelector(".gallery");
        
        this.activeSlideSize = obj.activeSlideSize;
        this.slidesSizes = obj.slideSize;
        this.containerWidth = this.body.getBoundingClientRect().width;

        this.translateX = obj.translate;
        
        this.slideImgs = this.container.querySelectorAll(".gallery-item .gallery-item__img");

        this.slideImgs.forEach(img => {
            img.style.width = this.slidesSizes.w + "px";
            img.style.height = this.slidesSizes.h + "px";
        });

        this.imgWraps = this.container.querySelectorAll(".gallery-item__img-wrap");
        this.imgWraps.forEach(wrap => {
            wrap.style.height = this.activeSlideSize.h + "px";
        });

        this.textSection = document.querySelector(".gallery-item__text-wrap").getBoundingClientRect().height;

        this.body.style.height = this.activeSlideSize.h + 10 + this.textSection + "px";

    }

    _activateCurrentSlide() {
        const img = this.slideImgs[this.currentSlideIdx];
        img.style.width = this.activeSlideSize.w + "px";
        img.style.height = this.activeSlideSize.h + "px";
    }

    _disactivateCurrentSlide() {
        const img = this.slideImgs[this.currentSlideIdx];
        img.style.width = this.slidesSizes.w + "px";
        img.style.height = this.slidesSizes.h + "px";
    }

    _changeSlide(direction) {

        const translateX = direction ? this.translateX : -this.translateX;

        this.isAvailableToSlide = false;
        this._disactivateCurrentSlide();

        setTimeout(() => {

            this.containerTranslateX += translateX;
            this.container.style.transform = `translateX(${-this.containerTranslateX}px)`;

            setTimeout(() => {

                direction ? this.currentSlideIdx++ : this.currentSlideIdx--;
                this._activateCurrentSlide();

                setTimeout(() => {
                    this.isAvailableToSlide = true;
                }, 500)

            }, 500);

        }, 500);

    }

}


const sliderSettings = {
    activeSlideSize: { w: 945, h: 515 },
    slideSize: { w: 590, h: 315 },
    // containerWidth: 1850,
    translate: 630,
    breakPoints: [
        {
            breakPoint: 1850,
            settings: {
                activeSlideSize: { w: 545, h: 315 },
                slideSize: { w: 290, h: 215 },
                translate: 320,
            }
        }
    ]
}

new Slider(sliderSettings);