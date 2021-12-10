export namespace  streams {
    export interface  BaseEntry {
        [key:string]: any
    }
    export interface  BaseStream {
        entries?: BaseEntry
        [key:string]: any
    }
    export namespace  cp_navigation {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: string
            svg?: string
            icon?: string
            image?: string
            title?: string
            parent?: string
            dropdown?: any[]
            active?: boolean
        }
    }
    export namespace  cp_shortcuts {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: string
            title?: string
            icon?: string
            svg?: string
            dropdown?: any[]
        }
    }
    export namespace  cp_themes {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: string
            spacing?: number
            radius?: number
            light?: string
            dark?: string
            white?: string
            black?: string
            text?: string
            buttons?: string
            primary?: string
            secondary?: string
        }
    }
    export namespace  core_streams {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: string
            name?: string
            description?: string
            source?: any[]
            config?: any[]
            fields?: any[]
            ui?: any[]
            api?: any[]
        }
    }
    export namespace  core_applications {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            handle?: string
            match?: any[]
            config?: any[]
        }
    }
    export namespace  clients {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: number
            name?: string
            email?: string
            age?: number
            relative?: string
            foo?: boolean
        }
    }
    export namespace  foobars {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: number
            name?: string
            email?: string
            age?: number
            options?: any[]
            links?: any[]
            menu?: any[]
        }
    }
    export namespace  people {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            name?: string
            height?: number
            mass?: number
            hair_color?: string
            skin_color?: string
            eye_color?: string
            birth_year?: string
            gender?: string
            homeworld?: string
            films?: string
            species?: string
            vehicles?: string
            starships?: string
            created?: Date
            edited?: Date
        }
    }
    export namespace  planets {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            name?: string
            rotation_period?: number
            orbital_period?: number
            diameter?: number
            climate?: string
            gravity?: string
            terrain?: string
            surface_water?: boolean
            population?: number
            residents?: string
            films?: string
            created?: Date
            edited?: Date
        }
    }
    export namespace  posts {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            id?: string
            entry?: string
            space?: string
            title?: string
            summary?: string
            likes?: number
            views?: number
            shares?: number
            privacy?: string
        }
    }
    export namespace  profiles {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            role?: string
            degrees?: any[]
            title?: string
            specialty?: string
            username?: string
        }
    }
    export namespace  starships {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            name?: string
            model?: string
            manufacturer?: string
            cost_in_credits?: number
            length?: number
            max_atmosphering_speed?: number
            crew?: string
            passengers?: number
            cargo_capacity?: number
            consumables?: string
            hyperdrive_rating?: number
            MGLT?: number
            starship_class?: number
            pilots?: string
            films?: string
            created?: Date
            edited?: Date
        }
    }
    export namespace  vehicles {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            name?: string
            model?: string
            manufacturer?: string
            cost_in_credits?: number
            length?: number
            max_atmosphering_speed?: number
            crew?: number
            passengers?: number
            cargo_capacity?: number
            consumables?: string
            vehicle_class?: string
            pilots?: string
            films?: string
            created?: Date
            edited?: Date
        }
    }
    export namespace  cli_blueprints {
        export interface  Stream extends BaseStream {
            entries?: Entry
        }
        export interface  Entry extends BaseEntry {
            template?: string
            parent?: string
        }
    }
    export interface  Entries {
        'cp.navigation': cp_navigation.Entry
        'cp.shortcuts': cp_shortcuts.Entry
        'cp.themes': cp_themes.Entry
        'core.streams': core_streams.Entry
        'core.applications': core_applications.Entry
        'clients': clients.Entry
        'foobars': foobars.Entry
        'people': people.Entry
        'planets': planets.Entry
        'posts': posts.Entry
        'profiles': profiles.Entry
        'starships': starships.Entry
        'vehicles': vehicles.Entry
        'cli.blueprints': cli_blueprints.Entry
        [key:string]: any
    }
    export interface  Streams {
        'cp.navigation': cp_navigation.Stream
        'cp.shortcuts': cp_shortcuts.Stream
        'cp.themes': cp_themes.Stream
        'core.streams': core_streams.Stream
        'core.applications': core_applications.Stream
        'clients': clients.Stream
        'foobars': foobars.Stream
        'people': people.Stream
        'planets': planets.Stream
        'posts': posts.Stream
        'profiles': profiles.Stream
        'starships': starships.Stream
        'vehicles': vehicles.Stream
        'cli.blueprints': cli_blueprints.Stream
        [key:string]: any
    }
    export type StreamID = keyof Streams
}