'use client'

import React from 'react'
import { ButtonSky, ButtonRed, ButtonGreen } from "@/components/global/Button";
import { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";

interface Data {
    id: number;
    id_pohon: number;
    kondisi_terukur: string;
    outcome_yang_ingin_diwujudkan: string;
    faktor_berpengaruh: string;
    data_terukur: string;
    kondisi_yang_diperlukan: string;
    intermediate_outcome: Intermediate;
}
interface Intermediate {
    indikator: string;
    target: string;
    satuan: string;
    keterangan: string;
}
interface CSF {
    id: number;
    pohon_id: number;
    parent: number;
    pernyataan_kondisi_strategis: string;
    alasan_sebagai_kondisi_strategis: string;
    data_terukur_pendukung_pernyataan: string;
    kondisi_terukur_yang_diharapkan: string;
    kondisi_yang_ingin_diwujudkan: string;
    nama_pohon: string;
    keterangan: string;
    indikator: indikator[];
}
interface indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: target[];
}
type target = {
    id_target: string;
    target: string;
    satuan: string;
};

const Table = () => {

    const [Outcome, setOutcome] = useState<Data[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();
    const { branding } = useBrandingContext();

    const [CSF, setCSF] = useState<CSF[]>([]);
    const [Sub, setSub] = useState<any[]>([]);
    const [GabunganOutcome, setGabunganOutcome] = useState<any[]>([]);

    useEffect(() => {
        const API_URL_CSF = process.env.NEXT_PUBLIC_API_URL_CSF;
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchOutcome = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL_CSF}/outcome/${branding?.tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                /* const data = result.data.tematiks; */
                const data = result.data;
                if (data == null) {
                    setDataNull(true);
                    setOutcome([]);
                } else if (data.code == 500) {
                    setError(true);
                    setOutcome([]);
                } else {
                    setDataNull(false);
                    setOutcome(data);
                    // console.log("hasil data outcome :", data);
                }
                setOutcome(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        const fetchCSF = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/isustrategis/csfs/${branding?.tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                /* const data = result.data.tematiks; */
                const data = result.data;
                // console.log(data);
                if (data == null) {
                    setDataNull(true);
                    setCSF([]);
                } else if (data.code == 500) {
                    setError(true);
                    setCSF([]);
                } else {
                    setDataNull(false);
                    setCSF(data);
                    // console.log(data);
                }
                setCSF(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        const fetchSubTematik = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/subtematik/${branding?.tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                /* const data = result.data.tematiks; */
                const data = result.data.tematiks;
                // console.log(data);
                if (data == null) {
                    setDataNull(true);
                    setSub([]);
                } else if (data.code == 500) {
                    setError(true);
                    setSub([]);
                } else {
                    setDataNull(false);
                    setSub(data);
                    // console.log(data);
                }
                setSub(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (branding?.tahun != undefined || branding?.tahun != null) {
            fetchOutcome();
            fetchCSF();
            fetchSubTematik();
        }
    }, [Tahun, token, branding]);

    useEffect(() => {
        if (!Sub || !Outcome) return;

        const gabungan = gabungData(Sub, Outcome);
        setGabunganOutcome(gabungan);
    }, [branding, Sub, Outcome]);

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Reload Halaman, Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (branding?.tahun == undefined || branding?.tahun === null) {
        return <TahunNull />
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-orange-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Kondisi Terukur Yang DiHarapkan/Seharusnya</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Outcome Yang Ingin Diwujudkan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Faktor yang Berpengaruh Terhadap Capaian Outcome/Penyebab Permasalahan (CSF)</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Data Terukur Terkait CSF</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Kondisi Yang Diperlukan Untuk Mencapai Outcome (Intermediate Outcome)</th>
                            <th colSpan={3} className="border-r border-b px-6 py-3 min-w-[200px]">Intermediate Outcome</th>
                        </tr>
                        <tr className="bg-orange-700 text-white">
                            <th className="border-r border-b px-6 py-1 min-w-[200px]">Indikator</th>
                            <th className="border-r border-b px-6 py-1 min-w-[200px]">Target/Satuan</th>
                            <th className="border-r border-b px-6 py-1 min-w-[200px]">Keterangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3 uppercase text-center" colSpan={10}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            CSF.map((data: CSF, index: number) => {
                                const outcomeList = GabunganOutcome.filter(go => go.parent === data.id);
                                const rowSpan = Math.max(outcomeList.length, 1);

                                return (
                                    <React.Fragment key={data.id || index}>
                                        {outcomeList.length > 0 ? (
                                            outcomeList.map((ol: any, subIndex: number) => (
                                                <tr key={`${data.id}-${subIndex}`}>
                                                    {subIndex === 0 && (
                                                        <>
                                                            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                                            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">{data.nama_pohon || "-"}</td>
                                                            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">
                                                                {data.indikator?.length > 0 ? (
                                                                    data.indikator.map((i: indikator, i_index: number) => (
                                                                        <div key={i_index}>{i.nama_indikator}</div>
                                                                    ))
                                                                ) : (
                                                                    <div>-</div>
                                                                )}
                                                            </td>
                                                        </>
                                                    )}

                                                    {/* Baris Outcome */}
                                                    <td className="border-r border-b px-6 py-4 text-center">{ol.faktor_berpengaruh || "-"}</td>
                                                    <td className="border-r border-b px-6 py-4 text-center">{ol.data_terukur || "-"}</td>
                                                    <td className="border-r border-b px-6 py-4">
                                                        <div className="flex flex-col justify-center items-center gap-2">
                                                            {ol.id_outcome === null ? (
                                                                <ButtonSky className="w-full" halaman_url={`/outcome/tambah/${ol.id}`}>Input Outcome</ButtonSky>
                                                            ) : (
                                                                <>
                                                                    <ButtonGreen className="w-full" halaman_url={`/outcome/tambah/${ol.id}`}>Edit</ButtonGreen>
                                                                    <ButtonRed
                                                                        className="w-full"
                                                                        onClick={() => {
                                                                            AlertQuestion("Hapus?", "Hapus Data Outcome yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                                                if (result.isConfirmed) {
                                                                                    // hapusOutcome(ol.id);
                                                                                }
                                                                            });
                                                                        }}
                                                                    >
                                                                        Hapus
                                                                    </ButtonRed>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="border-r border-b px-6 py-4 text-center">{ol.tema || "-"}</td>
                                                    <td className="border-r border-b px-6 py-4 text-center">
                                                        {ol.indikator?.length > 0 ? (
                                                            ol.indikator.map((i: indikator, i_index: number) => (
                                                                <div key={i_index}>{i.nama_indikator || "-"}</div>
                                                            ))
                                                        ) : (
                                                            "-"
                                                        )}
                                                    </td>
                                                    <td className="border-r border-b px-6 py-4 text-center">
                                                        {ol.indikator?.[0]?.targets?.map((t: any, t_index: number) => (
                                                            <div key={t_index}>{t.target || "-"} / {t.satuan || "-"}</div>
                                                        )) || "-"}
                                                    </td>
                                                    <td className="border-r border-b px-6 py-4 text-center">{ol.keterangan || "-"}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr key={`empty-${data.id}`}>
                                                <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                                                <td className="border-r border-b px-6 py-4 text-center">{data.nama_pohon || "-"}</td>
                                                <td className="border-r border-b px-6 py-4 text-center">
                                                    {data.indikator?.length > 0 ? (
                                                        data.indikator.map((i: indikator, i_index: number) => (
                                                            <div key={i_index}>{i.nama_indikator}</div>
                                                        ))
                                                    ) : (
                                                        <div>-</div>
                                                    )}
                                                </td>
                                                <td colSpan={7} className="border-b px-6 py-4 text-center italic text-gray-400">
                                                    Tidak ada Outcome
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;

function gabungData(subs: any, outcomes: any) {
    const hasil: any = [];
    subs.forEach((sub: any) => {
        const outcomeEntry = outcomes.find(
            ((outcome: any) => outcome.pohon_id == sub.id
                && outcome.parent_id == sub.parent))

        if (outcomeEntry) {
            hasil.push({
                id: sub.id,
                id_outcome: outcomeEntry.id,
                parent: sub.parent,
                faktor_berpengaruh: outcomeEntry.faktor_berpengaruh,
                data_terukur: outcomeEntry.data_terukur,
                tema: sub.tema,
                indikator: sub.indikator,
                keterangan: sub.keterangan
            })
        } else {
            hasil.push({
                id: sub.id,
                id_outcome: null,
                parent: sub.parent,
                faktor_berpengaruh: "-",
                data_terukur: "-",
                tema: sub.tema,
                indikator: sub.indikator,
                keterangan: sub.keterangan
            })
        }
    });
    return hasil;
}
