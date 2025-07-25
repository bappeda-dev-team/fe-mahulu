import { FiHome } from "react-icons/fi";
import { FormOutcome } from "../../FormOutcome";

const TambahTematikKab = () => {
    return(
        <>
            <div className="flex items-center mb-3">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Perencanaan Pemda</p>
                <p className="mr-1">/ Outcome</p>
                <p className="mr-1">/ Tambah</p>
            </div>
            <FormOutcome />
        </>
    )
}

export default TambahTematikKab;