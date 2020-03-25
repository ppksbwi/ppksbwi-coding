const { resolve } = require("path");
const package = require("./package.json");

module.exports = {
    dev: process.env.NODE_ENV !== "production",
    build: {
        cssSourceMap: false,
        parallel: false,
        cache: true,
        hardSource: true,
        optimizeCss: true,
        extractCSS: false,
        extend(config) {
            config.resolve.alias['vue'] = 'vue/dist/vue.common'
            const vueLoader = config.module.rules.find((rule) => rule.loader === 'vue-loader')
            vueLoader.options.cacheBusting = false
        },
        vendor: ['vue-swal'],
        /*
         ** You can extend webpack config here
         */
        extend(config, ctx) {}
    },
    mode: "spa",
    srcDir: resolve(__dirname, "./client"),
    router: {
        middleware: ["component-meta", "theme", "persist-skin"],
        scrollBehavior: function(to, from, savedPosition) {
            const container = document.getElementById("main-content");
            const contextContainer = document.getElementById("context-content");
            if (container) container.scrollTop = 0;
            if (contextContainer) contextContainer.scrollTop = 0;
            return {
                x: 0,
                y: 0
            };
        },
        extendRoutes(routes, resolve) {
            const newRoutes = []
            for (let i = 0; i < routes.length; i++) {
                for (let l = 1; l <= 10; l++) {
                    const newRoute = {...routes[i] }
                    const layout = 'demo' + l
                    newRoute.path = '/' + layout + newRoute.path
                    newRoute.name = layout + '-' + newRoute.name
                    if (!newRoute.meta) newRoute.meta = {}
                    newRoute.meta.layout = layout


                    newRoutes.push(newRoute)
                }
            }
            routes.unshift(...newRoutes)
        }
    },
    env: {
        apiURL: process.env.API_URL || "http://pp-ksbwi.com:8000"
    },
    head: {
        title: `${package.name} — ${package.description}`,
        meta: [
            { charset: "utf-8" },
            { name: "viewport", content: "width=device-width, initial-scale=1" }
        ],
        link: [{
                rel: "stylesheet",
                href: "https://fonts.googleapis.com/css?family=Poppins:100,400,500,600,700"
            },
            {
                rel: "stylesheet",
                href: "/font/typicons/typicons.min.css"
            },
            {
                rel: "stylesheet",
                href: "/font/fontawesome/css/all.css"
            },
            {
                rel: "stylesheet",
                href: "/font/weather-icons/css/weather-icons.min.css"
            },
            {
                rel: "stylesheet",
                href: "/font/line-awesome/css/line-awesome.min.css"
            },
            {
                rel: "stylesheet",
                href: "/font/linearicons/style.css"
            },
            {
                rel: "stylesheet",
                href: "/font/dripicons/webfont.css"
            },


        ],
        script: [{
            src: "https://code.jquery.com/jquery-3.3.1.min.js",
            type: "text/javascript"
        }, ]
    },
    css: ["normalize.css/normalize.css"],
    modules: [
        "bootstrap-vue/nuxt",
        '@nuxtjs/moment', [
            'nuxt-fontawesome', {
                imports: [{
                        set: '@fortawesome/free-solid-svg-icons',
                        icons: ['fas']
                    },
                    {
                        set: '@fortawesome/free-brands-svg-icons',
                        icons: ['fab']
                    }
                ]
            }
        ],
        '@nuxtjs/vuetify',
        '@nuxtjs/axios',
    ],
    axios: {
        baseURL: 'http://pp-ksbwi.com:8000',
        crossDomain: true,
    },
    // auth: {
    //     strategies: {
    //         local: {
    //             endpoints: {
    //                 login: { url: '/login', method: 'post', propertyName: 'data.token' },
    //                 user: { url: '/users', method: 'get', propertyName: 'data' },
    //                 logout: false
    //             }
    //         }
    //     }
    // },
    // auth: {
    //     strategies: {
    //       //METHOD LOGIN YANG AKAN KITA GUNAKAN
    //       local: {
    //         //DIMANA ENDPOINTNYA ADALAH
    //         endpoints: {
    //           //UNTUK LOGIN PADA BAGIAN URL, KITA MASUKKAN URL LOGIN DARI API YANG SUDAH KITA BUAT
    //           //SEDANGKAN PROPERTYNAME ADALAH PROPERTY YANG INGIN KITA AMBIL VALUENYA
    //           //DALAM HAL INI, LOGIN MENGHARAPKAN TOKEN, SEDANGKAN PADA API KITA ME-RETURN TOKEN DI DALAM OBJECT DATA
    //           login: { url: '/login', method: 'post', propertyName: 'data' },
    //           logout: { url: '/logout', method: 'post' },
    //           user: { url: '/users', method: 'get', propertyName: 'data' }
    //         },
    //         tokenRequired: true,
    //         tokenType: 'Bearer '
    //       }
    //     }
    // },
    bootstrapVue: {
        bootstrapCSS: false, // or `css`
        bootstrapVueCSS: false // or `bvCSS`
    },
    plugins: [
        { src: "~/plugins/vue-echarts.js", ssr: false },
        { src: "~/plugins/vue-editor.js", ssr: false },
        { src: "~/plugins/vue-filter-date-format.js", ssr: true },
        { src: "~/plugins/vue-morris.js", ssr: false },
        { src: "~/plugins/vue-numeral-filter.js", ssr: false },
        { src: "~/plugins/vue-upload-multiple-image.js", ssr: false },
        { src: "~/plugins/vue-simple-calendar.js", ssr: false },
        { src: "~/plugins/vue-kanban.js", ssr: false },
        { src: "~/plugins/vue-history-save/index.js", ssr: false },
        { src: "~/plugins/vue-truncate-filter.js" },
        { src: "~/plugins/vue-outside-click.js", ssr: false },
        { src: "~/plugins/vue2-scrollspy.js", ssr: false },
        { src: "~/plugins/vue-image-compare.js", ssr: false },
        { src: "~/plugins/aos.js", ssr: false },
        { src: "~/plugins/vue-perfect-scroll.js", ssr: false },
        { src: '~/plugins/google-analytics.js', ssr: false },
        '~/plugins/vue-swal',
        '~/plugins/helper.js',
    ],
    vendor: [
        "vue-upload-multiple-image",
        "vue-editor",
        "vue-echarts",
        "vue-simple-calendar",
        "vue-kanban"
    ],
    serverMiddleware: [resolve(__dirname, "./src")]
};