'use client'

import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useParams, useRouter, useSearchParams } from "next/navigation";
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
    const { branding } = useBrandingContext();
    const params = useSearchParams();
    const router = useRouter();
    const { id } = useParams();
    const id_parent = params.get('id_parent');

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL_CSF = process.env.NEXT_PUBLIC_API_URL_CSF;    
        const formData = {
            //key : value
            pohon_id: Number(id),
            parent_id: Number(id_parent),
            tahun: String(branding?.tahun?.value),
            faktor_outcome: data.faktor_outcome,
            data_terukur: data.data_terukur,
        };
        // console.log(formData);
        try {
            setProses(true);
            const response = await fetch(`${API_URL_CSF}/outcome`, {
                method: "POST",
                headers: {
                    // Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                AlertNotification("Berhasil", "Berhasil menambahkan data Outcome", "success", 1000);
                router.push("/outcome");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
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
export const FormEditOutcome = () => {

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValue>();
    const [Proses, setProses] = useState<boolean>(false);
    const [Loading, setLoading] = useState<boolean>(false);
    const { branding } = useBrandingContext();
    const { id } = useParams();

    useEffect(() => {
        const API_URL_CSF = process.env.NEXT_PUBLIC_API_URL_CSF;
        const fetchById = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL_CSF}/outcome/detail/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if(result.code === 200){

                } else {
                    console.log(result.data);
                }
            } catch(err){
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
    }, []);

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
                <h1 className="uppercase font-bold">Form Edit Data Outcome :</h1>
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