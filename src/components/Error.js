import warning from '../icons/warning.svg'

const computedDocument = getComputedStyle(document.documentElement)
const offset = 1
const maxerrors = 3

const Color = ({ id, title, desc }) => {
    const opacityNew = computedDocument.getPropertyValue('--maxerroropacity') - ((maxerrors * id) / 10) * offset

    return(
        <div id = { `error${id}` } className = "error text-snow w-[300px] bg-darkErrorDark rounded-md" style = {{ opacity: id === 0 ? 0 : opacityNew }}>
            <div className="title bg-darkErrorLight text-xs pl-3 py-1 text-[#000]/50 font-medium rounded-t-md">Error</div>
            <div className="content flex p-3 space-x-5 items-center">
                <img src={ warning } className='w-12' alt="error"/>
                <div className='text-sm break-all text-[#fff]/30'>
                    <div className="error-title font-medium">
                        { title }
                    </div>
                    <div className="error-content font-thin">
                        { desc }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Color