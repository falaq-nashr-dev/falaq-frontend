import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL, Request } from "../../../helpers/Request";
import { Author, BookCategory, BookType } from "../../../types";
import axios from "axios";
import { useBookStore } from "../../../store/admin/useBookStore";
import { parseInt } from "lodash";

const BooksForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { editingId, setEditingId } = useBookStore();
  const [image, setImage] = useState<null | File>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  const [bookTypes, setBookTypes] = useState<BookType[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  // useRef for input fields
  const nameRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLSelectElement>(null);
  const categoryRef = useRef<HTMLSelectElement>(null);
  const typeRef = useRef<HTMLSelectElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const salePriceRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const aboutRef = useRef<HTMLTextAreaElement>(null);
  const stockCountRef = useRef<HTMLInputElement>(null);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    setImageUrl(URL.createObjectURL(event.target.files![0]));
    setImage(event.target.files![0]);
  };

  useEffect(() => {
    if (
      location.state &&
      authors.length > 0 &&
      categories.length > 0 &&
      bookTypes.length > 0
    ) {
      nameRef.current!.value = location.state.name;
      authorRef.current!.value = location.state.author.id;
      categoryRef.current!.value = location.state.productCategory.id;
      typeRef.current!.value = location.state.productType.id;
      priceRef.current!.value = location.state.price + "";
      salePriceRef.current!.value = location.state.salePrice + "";
      descriptionRef.current!.value = location.state.description;
      aboutRef.current!.value = location.state.about;
      stockCountRef.current!.value = location.state.quantity + "";
    }
  }, [location, authors, categories, bookTypes]);

  const handleSave = async () => {
    const name = nameRef.current?.value || "";
    const author = authorRef.current?.value || "";
    const category = categoryRef.current?.value || "";
    const type = typeRef.current?.value || "";
    const price = parseInt(priceRef.current?.value || "0", 10);
    const salePrice = parseInt(salePriceRef.current?.value || "0", 10);
    const description = descriptionRef.current?.value || "";
    const about = aboutRef.current?.value || "";
    const stockCount = parseInt(stockCountRef.current?.value || "0", 10);

    const token = localStorage.getItem("token");

    if (
      name === "" ||
      author === "" ||
      category === "" ||
      type === "" ||
      price == 0 ||
      salePrice === 0 ||
      description === "" ||
      about === "" ||
      stockCount === 0 ||
      (!editingId && !image)
    ) {
      toast.error("Iltimos to'liq ma'lumotlarni kiriting.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("photo", image!);
      formData.append("name", name);
      formData.append("productTypeId", type);
      formData.append("productCategoryId", category);
      formData.append("authorId", author || ""); // Optional
      formData.append("price", price + "");
      formData.append("salePrice", salePrice + "");
      formData.append("quantity", stockCount + "");
      formData.append("description", description);
      formData.append("about", about);
      setLoading(true);

      if (editingId === "") {
        await axios.post(BASE_URL + "/products/add", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else {
        await axios.put(
          BASE_URL + `/products/${editingId}`,
          {
            name,
            productTypeId: type,
            productCategoryId: category,
            authorId: author,
            price,
            salePrice,
            quantity: stockCount,
            description,
            about,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      setEditingId("");
      toast.success("Muvaffaqiyatli");
      navigate("/admin/books");
    } catch (error) {
      console.log(typeof error);
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl("");
  };

  const fetchBookTypes = useCallback(async () => {
    try {
      const { data } = await Request<BookType[]>(
        "/product-type",
        "GET",
        {},
        true
      );
      setBookTypes(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const { data } = await Request<BookCategory[]>(
        "/product-category",
        "GET",
        {},
        true
      );
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAuthors = useCallback(async () => {
    try {
      const { data } = await Request<Author[]>("/authors", "GET", {}, true);
      setAuthors(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookTypes();
    fetchCategories();
    fetchAuthors();
  }, [fetchBookTypes, fetchCategories, fetchAuthors]);

  return (
    <div className="container p-3">
      <div className=" w-full max-w-[45rem] space-y-4">
        {/* image */}
        <div>
          <p className="font-medium mb-1">Kitob rasmi</p>
          {imageUrl !== "" ? (
            <div className="flex items-center gap-3">
              <img width={200} src={imageUrl} alt="image" />
              <button
                onClick={handleRemoveImage}
                className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md"
              >
                o'chirish
              </button>
            </div>
          ) : (
            <label
              htmlFor="banner"
              className="bg-white text-gray-500 font-semibold text-base rounded max-w-md h-52 flex flex-col items-center justify-center cursor-pointer border-2 border-gray-300 border-dashed  font-[sans-serif]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-11 mb-2 fill-gray-500"
                viewBox="0 0 32 32"
              >
                <path
                  d="M23.75 11.044a7.99 7.99 0 0 0-15.5-.009A8 8 0 0 0 9 27h3a1 1 0 0 0 0-2H9a6 6 0 0 1-.035-12 1.038 1.038 0 0 0 1.1-.854 5.991 5.991 0 0 1 11.862 0A1.08 1.08 0 0 0 23 13a6 6 0 0 1 0 12h-3a1 1 0 0 0 0 2h3a8 8 0 0 0 .75-15.956z"
                  data-original="#000000"
                />
                <path
                  d="M20.293 19.707a1 1 0 0 0 1.414-1.414l-5-5a1 1 0 0 0-1.414 0l-5 5a1 1 0 0 0 1.414 1.414L15 16.414V29a1 1 0 0 0 2 0V16.414z"
                  data-original="#000000"
                />
              </svg>
              Upload file
              <input
                onChange={handleFile}
                type="file"
                id="banner"
                className="hidden"
              />
              <p className="text-xs font-medium text-gray-400 mt-2">
                PNG, JPG SVG, WEBP, and GIF are Allowed.
              </p>
            </label>
          )}
        </div>
        {/* name */}
        <div>
          <label htmlFor="name" className="font-medium mb-1">
            Kitob nomi
          </label>
          <input
            ref={nameRef}
            type="text"
            id="name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="kitob nomi..."
            required
          />
        </div>
        {/* author */}
        <div>
          <label htmlFor="author" className="font-medium mb-1">
            Kitob muallifi
          </label>
          <select
            ref={authorRef}
            id="author"
            defaultValue={""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-blue-500"
          >
            <option value="" disabled>
              Muallifni tanlang
            </option>
            {authors.map((author) => (
              <option key={author.id} value={author.id}>
                {author.fullName}
              </option>
            ))}
          </select>
        </div>
        {/* price */}
        <div>
          <label htmlFor="price" className="font-medium mb-1">
            Kitob narxi
          </label>
          <input
            ref={priceRef}
            type="number"
            id="price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="kitob narxi..."
            required
          />
        </div>
        {/* sale price */}
        <div>
          <label htmlFor="price" className="font-medium mb-1">
            Chegirmadagi narxi
          </label>
          <input
            ref={salePriceRef}
            type="number"
            id="price"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="kitob narxi..."
            required
          />
        </div>
        {/* type */}
        <div>
          <label htmlFor="type" className="font-medium mb-1">
            Kitob turi
          </label>
          <select
            ref={typeRef}
            id="type"
            defaultValue={""}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-blue-500"
          >
            <option value="" disabled>
              Turni tanlang
            </option>
            {bookTypes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {/* category */}
        <div>
          <label htmlFor="category" className="font-medium mb-1">
            Kitob kategoriyasi
          </label>
          <select
            ref={categoryRef}
            defaultValue={""}
            id="category"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 focus:outline-blue-500"
          >
            <option value="" disabled>
              Kategoriya tanlang
            </option>
            {categories.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        {/* description */}
        <div>
          <label htmlFor="description" className="font-medium mb-1">
            Kitob tavsifi
          </label>
          <textarea
            ref={descriptionRef}
            id="description"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500"
            placeholder="Kitob tavsifini yozing..."
          ></textarea>
        </div>
        {/* about */}
        <div>
          <label htmlFor="about" className="font-medium mb-1">
            Kitob haqida
          </label>
          <textarea
            ref={aboutRef}
            id="about"
            rows={4}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 focus:outline-blue-500"
            placeholder="Kitob haqida yozing..."
          ></textarea>
        </div>
        {/* stock count */}
        <div>
          <label htmlFor="stockCount" className="font-medium mb-1">
            Do'kondagi soni
          </label>
          <input
            ref={stockCountRef}
            type="number"
            id="stockCount"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg outline-blue-500 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
            placeholder="Kitob soni..."
            required
          />
        </div>
        {/* save button */}
        <div className="flex justify-end">
          <button
            disabled={loading}
            onClick={handleSave}
            type="button"
            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300 font-medium rounded-lg text-sm px-9 py-2.5 me-2 mb-2 focus:outline-none disabled:opacity-60"
          >
            {loading ? "Saqlanmoqda" : "Saqlash"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BooksForm;
