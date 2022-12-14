import PrintFirtsLogWhenCustomerIsCreatedHandler from "./handler/print-first-log-when-customer-is-created.handler";
import PrintSecondLogWhenCustomerIsCreatedHandler from "./handler/print-second-log-when-customer-is-created.handler";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerChangedAddressEvent from "./customer-changed-address.event";
import PrintCustomerAddressWhenCustomerIsCreated from "./handler/print-customer-address-when-address-has-changed.handler";
import EventDispatcher from "../../@shared/event/event-dispatcher";

describe("Customer events tests", () => {
  it("Customer Created: Should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandlerFirst = new PrintFirtsLogWhenCustomerIsCreatedHandler();
    const eventHandlerSecond = new PrintSecondLogWhenCustomerIsCreatedHandler();
    const spyEventHandlerFirst = jest.spyOn(eventHandlerFirst, "handle");
    const spyEventHandlerSecond = jest.spyOn(eventHandlerSecond, "handle");

    eventDispatcher.register("CustomerCreatedEvent", eventHandlerFirst);
    eventDispatcher.register("CustomerCreatedEvent", eventHandlerSecond);

    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]
    ).toMatchObject(eventHandlerFirst);
    expect(
      eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]
    ).toMatchObject(eventHandlerSecond);

    const customerCreatedEvent = new CustomerCreatedEvent({
      name: "Joao",
      address: "xyz",
    });

    // Quando o notify for executado o SendEmailWhenProductIsCreatedHandler.handle() deve ser chamado
    eventDispatcher.notify(customerCreatedEvent);

    expect(spyEventHandlerFirst).toHaveBeenCalled();
    expect(spyEventHandlerSecond).toHaveBeenCalled();
  });

  it("Customer Changed: Should notify all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new PrintCustomerAddressWhenCustomerIsCreated();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);

    expect(
      eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]
    ).toMatchObject(eventHandler);

    const customerChangedAddressEvent = new CustomerChangedAddressEvent({
      id: "123",
      endereco: "rua x",
      nome: "customer",
    });

    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});
