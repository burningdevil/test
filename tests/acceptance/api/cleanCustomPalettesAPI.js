import authentication from './authentication'
import logout from './logout'
import getColorPalettesAPI from './getColorPalettesAPI'
import deleteColorPalettesAPI from './deleteColorPalettesAPI';
import { groupLog, groupLogEnd } from '../config/consoleFormat';


// cerify/decerfify dossier/document
export default async function cleanCustomPalettesAPI({ baseUrl, credentials }) {
    groupLog()
    const session = await authentication({ baseUrl, authMode: 1, credentials })
    const colorPalettes = await getColorPalettesAPI({ baseUrl, session })

    for (const item of colorPalettes) {
        if (item.paletteType === 1) continue;
        await deleteColorPalettesAPI({ baseUrl, session, paletteId: item.id, paletteName: item.name })
    }

    await logout({ baseUrl, session });
    groupLogEnd()
}
