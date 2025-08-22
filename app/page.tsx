"use client";
import { useMemo, useEffect, useState } from "react";
import axios from "axios";

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
};

export default function Home() {
  const textSize = "text-base md:text-xl";
  const contentMargin = "my-4";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);
    
    //  Buat data sebagai JSON pada public directory dan simpan call data di state
    axios
      .get("/users.json", { timeout: 8000 })
      .then((res) => {
        if (isMounted) setUsers(res.data);
      })
      .catch((err) => {
        if (isMounted) setError(err?.response?.data?.message || err.message || "Failed to fetch users");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    
    return () => {
      isMounted = false;
    };
  }, []);

  const userListItems = useMemo(() => {
    return users.map((u) => {
      const items: string[] = [
        `Username: ${u.username}`,
        `Email: ${u.email}`,
        `Phone: ${u.phone}`,
        `Website: ${u.website}`,
        `Company: ${u.company.name} — ${u.company.catchPhrase}`,
        `Address: ${u.address.suite}, ${u.address.street}, ${u.address.city} ${u.address.zipcode}`,
        `Geo: (${u.address.geo.lat}, ${u.address.geo.lng})`,
      ];
      return { id: u.id, name: u.name, items };
    });
  }, [users]);

  return (
    <div className="px-6 py-8">

      {/* Tambahkan indikator loading saat data sedang diambil */}
      {loading && <p>Loading users from local file...</p>}


      {/* Jika ada error, tampilkan pesan error */}
      {error && <p className="text-red-600">Error: {error}</p>}


      {!loading && !error && (
        <>
          {userListItems.map((section) => (
            <div key={section.id} className="mb-8">
              <h2 className="text-xl md:text-2xl font-semibold mb-3">{section.name}</h2>

              {/* Simpan data di state dan tampilkan dalam bentuk list. */}
              <ul className={`${textSize} list-disc pl-5 ${contentMargin}`}>
                {section.items.map((listItem, listIndex) => (
                  <li key={`list-item-${section.id}-${listIndex}`} className="mb-2">
                    {listItem}
                  </li>
                ))}
              </ul>


            </div>
          ))}
        </>
      )}
    </div>
  );
}
