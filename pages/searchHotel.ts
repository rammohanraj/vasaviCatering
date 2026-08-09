import { Locator, Page } from "@playwright/test";

export class SearchHotelPage {

    readonly page: Page;

    readonly location: Locator;
    readonly hotel: Locator;
    readonly roomType: Locator;
    readonly roomCount: Locator;
    readonly checkInDate: Locator;
    readonly checkOutDate: Locator;
    readonly adultPerRoom: Locator;
    readonly childPerRoom: Locator;
    readonly searchButton: Locator;


    constructor(page: Page) {

        this.page = page;

        this.location = page.locator("#location");
        this.hotel = page.locator("#hotels");
        this.roomType = page.locator("#room_type");
        this.roomCount = page.locator("#room_nos");

        this.checkInDate = page.locator("#datepick_in");
        this.checkOutDate = page.locator("#datepick_out");

        this.adultPerRoom = page.locator("#adult_room");
        this.childPerRoom = page.locator("#child_room");

        this.searchButton = page.locator("#Submit");
    }


    async searchHotel(
        location: string,
        hotel: string,
        roomType: string,
        roomCount: string,
        checkInDate: string,
        checkOutDate: string,
        adultPerRoom: string,
        childPerRoom: string
    ): Promise<void> {

        await this.location.selectOption({ label: location });
        await this.hotel.selectOption({ label: hotel });
        await this.roomType.selectOption({ label: roomType });
        await this.roomCount.selectOption({ label: roomCount });
        await this.checkInDate.fill(checkInDate);
        await this.checkOutDate.fill(checkOutDate);
        await this.adultPerRoom.selectOption({ label: adultPerRoom });
        await this.childPerRoom.selectOption({ label: childPerRoom });
    }
}
