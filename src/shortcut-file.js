"use strict";

import * as fs from 'fs';
import {Parser as VDFParser, Builder as VDFBuilder, Shortcut} from 'node-steam-shortcuts';
import crc from 'crc';
import {Uint64BE} from 'int64-buffer';
import * as r from 'ramda';

const defaultShortcutPath = 'steam-roms-importer';

export default class ShortcutFile {
    constructor(filePath)
    {
        this.filePath = filePath;
        this.shortcuts = [];

        this._readFile();
    }

    _readFile()
    {
        if (!fs.existsSync(this.filePath))
            return;

        let data = fs.readFileSync(this.filePath);

        try
        {
            this.shortcuts = VDFParser.parse(data).toJSON();

            this.shortcuts = r.map(
                (s) => new Shortcut(s), 
                r.filter(
                    s => s.ShortcutPath != defaultShortcutPath,
                    this.shortcuts)
            );

            console.log(this.shortcuts);
        }
        catch(e)
        {
            console.error(e);
        }
    }

    addShortcut(shortcut)
    {
        let s = new Shortcut(shortcut);

        s.ShortcutPath = defaultShortcutPath;
        s.custom = "toto";

        this.shortcuts.push(s);
        return s;
    }

    writeShortcuts(callback)
    {
        var data = VDFBuilder.build(this.shortcuts);

        fs.writeFile(this.filePath, data, (error) => callback(error));
    }
}