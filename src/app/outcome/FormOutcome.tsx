'use client'

import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter } from "next/navigation";
import Select from 'react-select';
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";

interface OptionTypeString {
    value: string;
    label: string;
}
interface FormValue {
    pohon_id: number;
    tahun: string;
    faktor_outcome: string;
    data_terukur: string;
}

export const FormOutcome = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [Proses, setProses] = useState<boolean>(false);
    const {branding} = useBrandingContext();
    const {id} = useParams();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const formData = {
            //key : value
            pohon_id: id,
            tahun: String(branding?.tahun?.value),
            faktor_outcome: data.faktor_outcome,
            data_terukur: data.data_terukur,
        };
        console.log(formData);
        // try {
        //     setProses(true);
        //     const response = await fetch(`${API_URL}/pohon_kinerja_admin/create`, {
        //         method: "POST",
        //         headers: {
        //             Authorization: `${token}`,
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify(formData),
        //     });
        //     if (response.ok) {
        //         AlertNotification("Berhasil", "Berhasil menambahkan data tematik pemda", "success", 1000);
        //         router.push("/outcome");
        //     } else {
        //         AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
        //     }
        // } catch (err) {
        //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        // } finally {
        //     setProses(false);
        // }
    };

    return (
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Tambah Data Outcome :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="faktor_outcome"
                        >
                            Faktor yang berpengaruh terhadap capaian outcome/penyebab permasalahan (CSF) :
                        </label>
                        <Controller
                            name="faktor_outcome"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="faktor_outcome"
                                        type="text"
                                        placeholder="masukkan Faktor yang berpengaruh"
                                    />
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="data_terukur"
                        >
                            Data terukur terkait CSF :
                        </label>
                        <Controller
                            name="data_terukur"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="data_terukur"
                                        type="text"
                                        placeholder="masukkan data terukur terkait CSF"
                                    />
                                </>
                            )}
                        />
                    </div>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                        disabled={Proses}
                    >
                        {Proses ?
                            <span className="flex">
                                <LoadingButtonClip />
                                Menyimpan...
                            </span>
                            :
                            "Simpan"
                        }
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/outcome">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
    )
}
// export const FormEditOutcome = () => {

//     const {
//         control,
//         handleSubmit,
//         reset,
//         formState: { errors },
//     } = useForm<FormValue>();
//     const [Outcome, setOutcome] = useState<string>('');
//     const [PenyebabPermasalahan, setPenyebabPermasalahan] = useState<string>('');
//     const [DataTerukur, setDataTerukur] = useState<string>('');
//     const [KondisiTerukur, setKondisiTerukur] = useState<string>('');
//     const [KondisiDiperlukan, setKondisiDiperlukan] = useState<string>('');
//     const [error, setError] = useState<string | null>(null);
//     const [loading, setLoading] = useState<boolean | null>(null);
//     const [idNull, setIdNull] = useState<boolean | null>(null);
//     const [Proses, setProses] = useState<boolean>(false);
//     const router = useRouter();
//     const { id } = useParams();
//     const token = getToken();

//     useEffect(() => {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         const fetchTematikKab = async () => {
//             setLoading(true);
//             try {
//                 const response = await fetch(`${API_URL}/pohon_kinerja_admin/detail/${id}`, {
//                     headers: {
//                         Authorization: `${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 });
//                 if (!response.ok) {
//                     throw new Error('terdapat kesalahan di koneksi backend');
//                 }
//                 const result = await response.json();
//                 if (result.code == 500 || result.code == 400) {
//                     setIdNull(true);
//                 } else {
//                     const data = result.data;
//                     if (data.outcome_yang_ingin_diwujudkan) {
//                         setOutcome(data.outcome_yang_ingin_diwujudkan);
//                         reset((prev) => ({ ...prev, outcome_yang_ingin_diwujudkan: data.outcome_yang_ingin_diwujudkan }))
//                     }
//                     if (data.penyebab_permasalahan) {
//                         setPenyebabPermasalahan(data.penyebab_permasalahan);
//                         reset((prev) => ({ ...prev, penyebab_permasalahan: data.penyebab_permasalahan }))
//                     }
//                     if (data.data_terukur) {
//                         setDataTerukur(data.data_terukur);
//                         reset((prev) => ({ ...prev, data_terukur: data.data_terukur }))
//                     }
//                     if (data.kondisi_terukur) {
//                         setKondisiTerukur(data.kondisi_terukur);
//                         reset((prev) => ({ ...prev, kondisi_terukur: data.kondisi_terukur }))
//                     }
//                     if (data.kondisi_yang_diperlukan) {
//                         setKondisiDiperlukan(data.kondisi_yang_diperlukan);
//                         reset((prev) => ({ ...prev, kondisi_yang_diperlukan: data.kondisi_yang_diperlukan }))
//                     }
//                 }
//             } catch (err) {
//                 setError('gagal mendapatkan data, periksa koneksi internet atau database server')
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchTematikKab();
//     }, [id, reset, token]);

//     const onSubmit: SubmitHandler<FormValue> = async (data) => {
//         const API_URL = process.env.NEXT_PUBLIC_API_URL;
//         const formData = {
//             //key : value
//             outcome_yang_ingin_diwujudkan: data.outcome_yang_ingin_diwujudkan,
//             penyebab_permasalahan: data.penyebab_permasalahan,
//             data_terukur: data.data_terukur,
//             kondisi_terukur: data.kondisi_terukur,
//             kondisi_yang_diperlukan: data.kondisi_yang_diperlukan,
//         };
//         console.log(formData);
//         // try {
//         //     setProses(true);
//         //     const response = await fetch(`${API_URL}/pohon_kinerja_admin/update/${id}`, {
//         //         method: "PUT",
//         //         headers: {
//         //             Authorization: `${token}`,
//         //             'Content-Type': 'application/json',
//         //         },
//         //         body: JSON.stringify(formData),
//         //     });
//         //     if (response.ok) {
//         //         AlertNotification("Berhasil", "Berhasil edit data tematik kabupaten", "success", 1000);
//         //         router.push("/outcome");
//         //     } else {
//         //         AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
//         //     }
//         // } catch (err) {
//         //     AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
//         // } finally {
//         //     setProses(false);
//         // }
//     };

//     if (loading) {
//         return (
//             <div className="border p-5 rounded-xl shadow-xl">
//                 <h1 className="uppercase font-bold">Form Edit Outcome :</h1>
//                 <LoadingClip className="mx-5 py-5" />
//             </div>
//         );
//     } else if (error) {
//         return (
//             <div className="border p-5 rounded-xl shadow-xl">
//                 <h1 className="uppercase font-bold">Form Edit Outcome :</h1>
//                 <h1 className="text-red-500 mx-5 py-5">{error}</h1>
//             </div>
//         )
//     } else if (idNull) {
//         return (
//             <div className="border p-5 rounded-xl shadow-xl">
//                 <h1 className="uppercase font-bold">Form Edit Outcome :</h1>
//                 <h1 className="text-red-500 mx-5 py-5">id tematik tidak ditemukan</h1>
//             </div>
//         )
//     } else {
//         return (
//             <>
//                 <div className="border p-5 rounded-xl shadow-xl">
//                     <h1 className="uppercase font-bold">Form Edit Outcome :</h1>
//                     <form
//                         onSubmit={handleSubmit(onSubmit)}
//                         className="flex flex-col mx-5 py-5"
//                     >
//                         <div className="flex flex-col py-3">
//                             <label
//                                 className="uppercase text-xs font-bold text-gray-700 my-2"
//                                 htmlFor="outcome_yang_ingin_diwujudkan"
//                             >
//                                 Outcome yang Ingin Diwujudkan :
//                             </label>
//                             <Controller
//                                 name="outcome_yang_ingin_diwujudkan"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <>
//                                         <input
//                                             {...field}
//                                             className="border px-4 py-2 rounded-lg"
//                                             id="outcome_yang_ingin_diwujudkan"
//                                             type="text"
//                                             placeholder="masukkan Outcome yang Ingin Diwujudkan"
//                                             value={field.value || Outcome}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                                 setOutcome(e.target.value);
//                                             }}
//                                         />
//                                     </>
//                                 )}
//                             />
//                         </div>
//                         <div className="flex flex-col py-3">
//                             <label
//                                 className="uppercase text-xs font-bold text-gray-700 my-2"
//                                 htmlFor="penyebab_permasalahan"
//                             >
//                                 Penyebab permasalahan :
//                             </label>
//                             <Controller
//                                 name="penyebab_permasalahan"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <>
//                                         <input
//                                             {...field}
//                                             className="border px-4 py-2 rounded-lg"
//                                             id="penyebab_permasalahan"
//                                             type="text"
//                                             placeholder="masukkan Penyebab permasalahan"
//                                             value={field.value || PenyebabPermasalahan}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                                 setPenyebabPermasalahan(e.target.value);
//                                             }}
//                                         />
//                                     </>
//                                 )}
//                             />
//                         </div>
//                         <div className="flex flex-col py-3">
//                             <label
//                                 className="uppercase text-xs font-bold text-gray-700 my-2"
//                                 htmlFor="data_terukur"
//                             >
//                                 Data Terukur Terkait CSF :
//                             </label>
//                             <Controller
//                                 name="data_terukur"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <>
//                                         <input
//                                             {...field}
//                                             className="border px-4 py-2 rounded-lg"
//                                             id="data_terukur"
//                                             type="text"
//                                             placeholder="masukkan Data Terukur Terkait CSF"
//                                             value={field.value || DataTerukur}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                                 setDataTerukur(e.target.value);
//                                             }}
//                                         />
//                                     </>
//                                 )}
//                             />
//                         </div>
//                         <div className="flex flex-col py-3">
//                             <label
//                                 className="uppercase text-xs font-bold text-gray-700 my-2"
//                                 htmlFor="kondisi_terukur"
//                             >
//                                 Kondisi Terukur Yang Diharapkan :
//                             </label>
//                             <Controller
//                                 name="kondisi_terukur"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <>
//                                         <input
//                                             {...field}
//                                             className="border px-4 py-2 rounded-lg"
//                                             id="kondisi_terukur"
//                                             type="text"
//                                             placeholder="masukkan Kondisi Terukur Yang Diharapkan"
//                                             value={field.value || KondisiTerukur}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                                 setKondisiTerukur(e.target.value);
//                                             }}
//                                         />
//                                     </>
//                                 )}
//                             />
//                         </div>
//                         <div className="flex flex-col py-3">
//                             <label
//                                 className="uppercase text-xs font-bold text-gray-700 my-2"
//                                 htmlFor="kondisi_yang_diperlukan"
//                             >
//                                 Kondisi yang Diperlukan Untuk Mencapai Outcome :
//                             </label>
//                             <Controller
//                                 name="kondisi_yang_diperlukan"
//                                 control={control}
//                                 render={({ field }) => (
//                                     <>
//                                         <input
//                                             {...field}
//                                             className="border px-4 py-2 rounded-lg"
//                                             id="kondisi_yang_diperlukan"
//                                             type="text"
//                                             placeholder="masukkan Kondisi yang Diperlukan Untuk Mencapai Outcome"
//                                             value={field.value || KondisiDiperlukan}
//                                             onChange={(e) => {
//                                                 field.onChange(e);
//                                                 setKondisiDiperlukan(e.target.value);
//                                             }}
//                                         />
//                                     </>
//                                 )}
//                             />
//                         </div>
//                         <ButtonGreen
//                             type="submit"
//                             className="my-4"
//                             disabled={Proses}
//                         >
//                             {Proses ?
//                                 <span className="flex">
//                                     <LoadingButtonClip />
//                                     Menyimpan...
//                                 </span>
//                                 :
//                                 "Simpan"
//                             }
//                         </ButtonGreen>
//                         <ButtonRed type="button" halaman_url="/outcome">
//                             Kembali
//                         </ButtonRed>
//                     </form>
//                 </div>
//             </>
//         )
//     }
// }