import { useState } from "react";
import { Drawer } from "vaul";
import { Request } from "../../../../helpers/Request";
import toast from "react-hot-toast";

interface AdminsModalProps {
  open: boolean;
  handleClose: () => void;
  refresh: () => Promise<void>;
}

const AdminsModal = ({ handleClose, open, refresh }: AdminsModalProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthday: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleClear = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      birthday: "",
      password: "",
    });
    handleClose();
  };

  const handleSave = async () => {
    const { firstName, lastName, phoneNumber, birthday, password } = formData;

    if (
      !firstName ||
      !lastName ||
      !phoneNumber.trim() ||
      !birthday ||
      !password.trim()
    ) {
      toast.error("Bo'sh maydonlarni kiriting");
      return;
    }

    try {
      setLoading(true);
      await Request(
        "/super-admin/add-admin",
        "POST",
        {
          ...formData,
          phoneNumber: formData.phoneNumber.trim(),
          password: formData.password.trim(),
        },
        true
      );
      toast.success("Admin muvaffaqiyatli qo'shildi!");
      handleClear();
      await refresh();
    } catch (error) {
      toast.error("Xatolik yuz berdi. Qayta urinib ko'ring.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer.Root
      direction="right"
      dismissible={false}
      onClose={handleClose}
      open={open}
      onOpenChange={handleClose}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-10 outline-none min-w-[390px] flex"
          style={
            { "--initial-transform": "calc(100% + 8px)" } as React.CSSProperties
          }
        >
          <div className="w-full p-4 bg-white rounded-t-[10px]">
            <p className="text-lg font-medium text-center">Admin yaratish</p>
            <div className="mt-2 py-3 px-1">
              {[
                "firstName",
                "lastName",
                "phoneNumber",
                "birthday",
                "password",
              ].map((field, index) => (
                <div key={index} className="w-full mt-3">
                  <label
                    htmlFor={field}
                    className="font-medium mb-1 capitalize"
                  >
                    {field === "firstName"
                      ? "Ism"
                      : field === "lastName"
                      ? "Familiya"
                      : field === "phoneNumber"
                      ? "Telefon raqam"
                      : field === "password"
                      ? "Parol"
                      : "Tug'ilgan kuni"}
                  </label>
                  <input
                    id={field}
                    value={formData[field as keyof typeof formData]}
                    onChange={handleInputChange}
                    disabled={loading}
                    type={field === "birthday" ? "date" : "text"}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    placeholder={` ${
                      field === "birthday" ? "tug'ilgan kuni" : field
                    }...`}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-x-3">
              <button
                onClick={handleClear}
                className="group bg-[#EFEEF0] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-4 py-2 text-center hover:opacity-80 flex items-center gap-x-2 justify-center mt-5 w-full"
              >
                Bekor qilish
              </button>
              <button
                disabled={loading}
                onClick={handleSave}
                className="text-white group bg-[#2473F2] focus:ring-1 focus:outline-none focus:ring-blue-300 rounded-lg px-4 py-2 text-center hover:opacity-80 flex items-center gap-x-2 justify-center mt-5 w-full"
              >
                {loading ? "Saqlanmoqda..." : "Saqlash"}
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default AdminsModal;
