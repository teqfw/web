/**
 * Interface for shared part of transborder event (been sent between front and back).
 * @interface
 */
export default class TeqFw_Core_Shared_Api_IEvent {
    /**
     * Create event DTO from given data.
     * @param [data]
     * @return {Object}
     */
    createDto(data) {}

    /**
     * Get event name (should be unique among all other events names).
     * @return {string}
     */
    getName() {}
}
