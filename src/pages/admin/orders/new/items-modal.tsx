import { Drawer } from "vaul";
import { Order } from "../../../../types";

interface ItemsModalprops {
  open: boolean;
  handleClose: () => void;
  item: Order;
}

const ItemsModal = ({ handleClose, open, item }: ItemsModalprops) => {
  return (
    <div>
      <Drawer.Root
        open={open}
        onOpenChange={handleClose}
        onClose={handleClose}
        direction="right"
      >
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40" />
          <Drawer.Content
            className="right-2 top-2 bottom-2 fixed z-10 outline-none min-w-[390px] flex"
            // The gap between the edge of the screen and the drawer is 8px in this case.
            style={
              {
                "--initial-transform": "calc(100% + 8px)",
              } as React.CSSProperties
            }
          >
            <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px]">
              <div className="max-w-lg w-full mx-auto">
                <Drawer.Title className="font-medium mb-2 text-zinc-900">
                  Buyurtma mahsulotlari
                </Drawer.Title>
                <Drawer.Description className="text-zinc-600 mb-2"></Drawer.Description>
                <div className="mt-4 space-y-1 w-full">
                  {item !== null &&
                    item.products.map((pr, ind) => (
                      <div
                        className="flex items-center gap-x-3  rounded-md  w-full"
                        key={ind}
                      >
                        <p className="font-medium">{pr.productName}-</p>
                        <p>{pr.quantity} ta</p>
                        <p>
                          {pr.price?.toLocaleString()}
                          so'm
                        </p>
                      </div>
                    ))}
                  <div className="!mt-5 flex justify-end">
                    <h1 className="text-lg font-medium">
                      Umumiy narx:{" "}
                      <span className="text-blue-500">
                        {item?.totalPrice?.toLocaleString()}
                        so'm
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>
    </div>
  );
};

export default ItemsModal;
