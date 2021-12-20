import { MimeType } from './mimes';


export type ResponseHeaderValue = string
export type RequestHeaderValue = any
export type HeaderValue = string

export interface StandardRequestHeaders {
    /**
     * Acceptable instance-manipulations for the request.
     *
     * @example
     * A-IM: feed
     */
    'A-IM'?: RequestHeaderValue;
    /**
     * Media type(s) that is/are acceptable for the response. See Content negotiation.
     *
     * @example
     * Accept: text/html
     */
    'Accept'?: RequestHeaderValue | MimeType;
    /**
     * Character sets that are acceptable.
     *
     * @example
     * Accept-Charset: utf-8
     */
    'Accept-Charset'?: RequestHeaderValue | BufferEncoding;
    /**
     * Acceptable version in time.
     *
     * @example
     * Accept-Datetime: Thu, 31 May 2007 20:35:00 GMT
     */
    'Accept-Datetime'?: RequestHeaderValue;
    /**
     * List of acceptable encodings. See HTTP compression.
     *
     * @example
     * Accept-Encoding: gzip, deflate
     */
    'Accept-Encoding'?: RequestHeaderValue;
    /**
     * List of acceptable human languages for response. See Content negotiation.
     *
     * @example
     * Accept-Language: en-US
     */
    'Accept-Language'?: RequestHeaderValue;
    /**
     * Initiates a request for cross-origin resource sharing with Origin (below).
     *
     * @example
     * Access-Control-Request-Method: GET
     */
    'Access-Control-Request-Method,Access-Control-Request-Headers'?: RequestHeaderValue;
    /**
     * Authentication credentials for HTTP authentication.
     *
     * @example
     * Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
     */
    'Authorization'?: RequestHeaderValue;
    /**
     * Used to specify directives that must be obeyed by all caching mechanisms along the request-response chain.
     *
     * @example
     * Cache-Control: no-cache
     */
    'Cache-Control'?: RequestHeaderValue;
    /**
     * Control options for the current connection and list of hop-by-hop request fields.            Must not be used with HTTP/2.[13]
     *
     * @example
     * Connection: keep-alive            Connection: Upgrade
     */
    'Connection'?: RequestHeaderValue;
    /**
     * The type of encoding used on the data. See HTTP compression.
     *
     * @example
     * Content-Encoding: gzip
     */
    'Content-Encoding'?: RequestHeaderValue;
    /**
     * The length of the request body in octets (8-bit bytes).
     *
     * @example
     * Content-Length: 348
     */
    'Content-Length'?: RequestHeaderValue;
    /**
     * A Base64-encoded binary MD5 sum of the content of the request body.
     *
     * @example
     * Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
     */
    'Content-MD5'?: RequestHeaderValue;
    /**
     * The Media type of the body of the request (used with POST and PUT requests).
     *
     * @example
     * Content-Type: application/x-www-form-urlencoded
     */
    'Content-Type'?: RequestHeaderValue|MimeType;
    /**
     * An HTTP cookie previously sent by the server with Set-Cookie (below).
     *
     * @example
     * Cookie: $Version=1; Skin=new;
     */
    'Cookie'?: RequestHeaderValue;
    /**
     * The date and time at which the message was originated (in "HTTP-date" format as defined by RFC 7231 Date/Time Formats).
     *
     * @example
     * Date: Tue, 15 Nov 1994 08:12:31 GMT
     */
    'Date'?: RequestHeaderValue;
    /**
     * Indicates that particular server behaviors are required by the client.
     *
     * @example
     * Expect: 100-continue
     */
    'Expect'?: RequestHeaderValue;
    /**
     * Disclose original information of a client connecting to a web server through an HTTP proxy.
     *
     * @example
     * Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43 Forwarded: for=192.0.2.43, for=198.51.100.17
     */
    'Forwarded'?: RequestHeaderValue;
    /**
     * The email address of the user making the request.
     *
     * @example
     * From: user@example.com
     */
    'From'?: RequestHeaderValue;
    /**
     * The domain name of the server (for virtual hosting), and the TCP port number on which the server is listening. The port number may be omitted if the port is the standard port for the service requested.            Mandatory since HTTP/1.1.                If the request is generated directly in HTTP/2, it should not be used.[17]
     *
     * @example
     * Host: en.wikipedia.org:8080            Host: en.wikipedia.org
     */
    'Host'?: RequestHeaderValue;
    /**
     * A request that upgrades from HTTP/1.1 to HTTP/2 MUST include exactly one HTTP2-Setting header field. The HTTP2-Settings header field is a connection-specific header field that includes parameters that govern the HTTP/2 connection, provided in anticipation of the server accepting the request to upgrade.[19]
     *
     * @example
     * HTTP2-Settings: token64
     */
    'HTTP2-Settings'?: RequestHeaderValue;
    /**
     * Only perform the action if the client supplied entity matches the same entity on the server. This is mainly for methods like PUT to only update a resource if it has not been modified since the user last updated it.
     *
     * @example
     * If-Match: "737060cd8c284d8af7ad3082f209582d"
     */
    'If-Match'?: RequestHeaderValue;
    /**
     * Allows a 304 Not Modified to be returned if content is unchanged.
     *
     * @example
     * If-Modified-Since: Sat, 29 Oct 1994 19:43:31 GMT
     */
    'If-Modified-Since'?: RequestHeaderValue;
    /**
     * Allows a 304 Not Modified to be returned if content is unchanged, see HTTP ETag.
     *
     * @example
     * If-None-Match: "737060cd8c284d8af7ad3082f209582d"
     */
    'If-None-Match'?: RequestHeaderValue;
    /**
     * If the entity is unchanged, send me the part(s) that I am missing; otherwise, send me the entire new entity.
     *
     * @example
     * If-Range: "737060cd8c284d8af7ad3082f209582d"
     */
    'If-Range'?: RequestHeaderValue;
    /**
     * Only send the response if the entity has not been modified since a specific time.
     *
     * @example
     * If-Unmodified-Since: Sat, 29 Oct 1994 19:43:31 GMT
     */
    'If-Unmodified-Since'?: RequestHeaderValue;
    /**
     * Limit the number of times the message can be forwarded through proxies or gateways.
     *
     * @example
     * Max-Forwards: 10
     */
    'Max-Forwards'?: RequestHeaderValue;
    /**
     * Initiates a request for cross-origin resource sharing (asks server for Access-Control-* response fields).
     *
     * @example
     * Origin: http://www.example-social-network.com
     */
    'Origin'?: RequestHeaderValue;
    /**
     * Implementation-specific fields that may have various effects anywhere along the request-response chain.
     *
     * @example
     * Pragma: no-cache
     */
    'Pragma'?: RequestHeaderValue;
    /**
     * Allows client to request that certain behaviors be employed by a server while processing a request.
     *
     * @example
     * Prefer: return=representation
     */
    'Prefer'?: RequestHeaderValue;
    /**
     * Authorization credentials for connecting to a proxy.
     *
     * @example
     * Proxy-Authorization: Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ==
     */
    'Proxy-Authorization'?: RequestHeaderValue;
    /**
     * Request only part of an entity. Bytes are numbered from 0. See Byte serving.
     *
     * @example
     * Range: bytes=500-999
     */
    'Range'?: RequestHeaderValue;
    /**
     * This is the address of the previous web page from which a link to the currently requested page was followed. (The word "referrer" has been misspelled in the RFC as well as in most implementations to the point that it has become standard usage and is considered correct terminology)
     *
     * @example
     * Referer: http://en.wikipedia.org/wiki/Main_Page
     */
    'Referer [sic]'?: RequestHeaderValue;
    /**
     * The transfer encodings the user agent is willing to accept: the same values as for the response header field Transfer-Encoding can be used, plus the "trailers" value (related to the "chunked" transfer method) to notify the server it expects to receive additional fields in the trailer after the last, zero-sized, chunk.            Only trailers is supported in HTTP/2.
     *
     * @example
     * TE: trailers, deflate
     */
    'TE'?: RequestHeaderValue;
    /**
     * The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer coding.
     *
     * @example
     * Trailer: Max-Forwards
     */
    'Trailer'?: RequestHeaderValue;
    /**
     * The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity.            Must not be used with HTTP/2.
     *
     * @example
     * Transfer-Encoding: chunked
     */
    'Transfer-Encoding'?: RequestHeaderValue;
    /**
     * The user agent string of the user agent.
     *
     * @example
     * User-Agent: Mozilla/5.0 (X11; Linux x86_64; rv:12.0) Gecko/20100101 Firefox/12.0
     */
    'User-Agent'?: RequestHeaderValue;
    /**
     * Ask the server to upgrade to another protocol.            Must not be used in HTTP/2.
     *
     * @example
     * Upgrade: h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket
     */
    'Upgrade'?: RequestHeaderValue;
    /**
     * Informs the server of proxies through which the request was sent.
     *
     * @example
     * Via: 1.0 fred, 1.1 example.com (Apache/1.1)
     */
    'Via'?: RequestHeaderValue;
    /**
     * A general warning about possible problems with the entity body.
     *
     * @example
     * Warning: 199 Miscellaneous warning
     */
    'Warning'?: RequestHeaderValue;

}

export interface NonStandardRequestHeaders {
    /**
     * Tells a server which (presumably in the middle of a HTTP -> HTTPS migration) hosts mixed content that the client would prefer redirection to HTTPS and can handle Content-Security-Policy: upgrade-insecure-requests            Must not be used with HTTP/2
     *
     * @example
     * Upgrade-Insecure-Requests: 1
     */
    'Upgrade-Insecure-Requests'?: RequestHeaderValue;
    /**
     * Mainly used to identify Ajax requests (most JavaScript frameworks send this field with value of XMLHttpRequest); also identifies Android apps using WebView
     *
     * @example
     * X-Requested-With: XMLHttpRequest
     */
    'X-Requested-With'?: RequestHeaderValue;
    /**
     * Requests a web application to disable their tracking of a user. This is Mozilla's version of the X-Do-Not-Track header field (since Firefox 4.0 Beta 11). Safari and IE9 also have support for this field. On March 7, 2011, a draft proposal was submitted to IETF.[24] The W3C Tracking Protection Working Group is producing a specification.[25]
     *
     * @example
     * DNT: 1 (Do Not Track Enabled)            DNT: 0 (Do Not Track Disabled)
     */
    'DNT'?: RequestHeaderValue;
    /**
     * A de facto standard for identifying the originating IP address of a client connecting to a web server through an HTTP proxy or load balancer. Superseded by Forwarded header.
     *
     * @example
     * X-Forwarded-For: client1, proxy1, proxy2            X-Forwarded-For: 129.78.138.66, 129.78.64.103
     */
    'X-Forwarded-For'?: RequestHeaderValue;
    /**
     * A de facto standard for identifying the original host requested by the client in the Host HTTP request header, since the host name and/or port of the reverse proxy (load balancer) may differ from the origin server handling the request. Superseded by Forwarded header.
     *
     * @example
     * X-Forwarded-Host: en.wikipedia.org:8080            X-Forwarded-Host: en.wikipedia.org
     */
    'X-Forwarded-Host'?: RequestHeaderValue;
    /**
     * A de facto standard for identifying the originating protocol of an HTTP request, since a reverse proxy (or a load balancer) may communicate with a web server using HTTP even if the request to the reverse proxy is HTTPS. An alternative form of the header (X-ProxyUser-Ip) is used by Google clients talking to Google servers. Superseded by Forwarded header.
     *
     * @example
     * X-Forwarded-Proto: https
     */
    'X-Forwarded-Proto'?: RequestHeaderValue;
    /**
     * Non-standard header field used by Microsoft applications and load-balancers
     *
     * @example
     * Front-End-Https: on
     */
    'Front-End-Https'?: RequestHeaderValue;
    /**
     * Requests a web application to override the method specified in the request (typically POST) with the method given in the header field (typically PUT or DELETE). This can be used when a user agent or firewall prevents PUT or DELETE methods from being sent directly (note that this is either a bug in the software component, which ought to be fixed, or an intentional configuration, in which case bypassing it may be the wrong thing to do).
     *
     * @example
     * X-HTTP-Method-Override: DELETE
     */
    'X-Http-Method-Override'?: RequestHeaderValue;
    /**
     * Allows easier parsing of the MakeModel/Firmware that is usually found in the User-Agent String of AT&T Devices
     *
     * @example
     * X-Att-Deviceid: GT-P7320/P7320XXLPG
     */
    'X-ATT-DeviceId'?: RequestHeaderValue;
    /**
     * Links to an XML file on the Internet with a full description and details about the device currently connecting. In the example to the right is an XML file for an AT&T Samsung Galaxy S2.
     *
     * @example
     * x-wap-profile: http://wap.samsungmobile.com/uaprof/SGH-I777.xml
     */
    'X-Wap-Profile'?: RequestHeaderValue;
    /**
     * Implemented as a misunderstanding of the HTTP specifications. Common because of mistakes in implementations of early HTTP versions. Has exactly the same functionality as standard Connection field.            Must not be used with HTTP/2.
     *
     * @example
     * Proxy-Connection: keep-alive
     */
    'Proxy-Connection'?: RequestHeaderValue;
    /**
     * Server-side deep packet insertion of a unique ID identifying customers of Verizon Wireless; also known as "perma-cookie" or "supercookie"
     *
     * @example
     * X-UIDH: ...
     */
    'X-UIDH'?: RequestHeaderValue;
    /**
     * Used to prevent cross-site request forgery. Alternative header names are: X-CSRFToken and X-XSRF-TOKEN[39]
     *
     * @example
     * X-Csrf-Token: i8XNjC4b8KVok4uw5RftR38Wgp2BFwql
     */
    'X-Csrf-Token'?: RequestHeaderValue;
    /**
     * Correlates HTTP requests between a client and server.
     *
     * @example
     * X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
     */
    'X-Request-ID'?: RequestHeaderValue;
    /**
     * The Save-Data client hint request header available in Chrome, Opera, and Yandex browsers lets developers deliver lighter, faster applications to users who opt-in to data saving mode in their browser.
     *
     * @example
     * Save-Data: on
     */
    'Save-Data'?: RequestHeaderValue;

}

export interface StandardResponseHeaders {
    /**
     * Requests HTTP Client Hints
     *
     * @example
     * Accept-CH: UA, Platform
     */
    'Accept-CH'?: ResponseHeaderValue;
    /**
     * Specifying which web sites can participate in cross-origin resource sharing
     *
     * @example
     * Access-Control-Allow-Origin: *
     */
    'Access-Control-Allow-Origin'?: ResponseHeaderValue;
    'Access-Control-Allow-Credentials'?: ResponseHeaderValue;
    'Access-Control-Expose-Headers'?: ResponseHeaderValue;
    'Access-Control-Max-Age'?: ResponseHeaderValue;
    'Access-Control-Allow-Methods'?: ResponseHeaderValue;
    'Access-Control-Allow-Headers'?: ResponseHeaderValue;
    /**
     * Specifies which patch document formats this server supports
     *
     * @example
     * Accept-Patch: text/example;charset=utf-8
     */
    'Accept-Patch'?: ResponseHeaderValue;
    /**
     * What partial content range types this server supports via byte serving
     *
     * @example
     * Accept-Ranges: bytes
     */
    'Accept-Ranges'?: ResponseHeaderValue;
    /**
     * The age the object has been in a proxy cache in seconds
     *
     * @example
     * Age: 12
     */
    'Age'?: ResponseHeaderValue;
    /**
     * Valid methods for a specified resource. To be used for a 405 Method not allowed
     *
     * @example
     * Allow: GET, HEAD
     */
    'Allow'?: ResponseHeaderValue;
    /**
     * A server uses "Alt-Svc" header (meaning Alternative Services) to indicate that its resources can also be accessed at a different network location (host or port) or using a different protocol            When using HTTP/2, servers should instead send an ALTSVC frame.
     *
     * @example
     * Alt-Svc: http/1.1="http2.example.com:8001"; ma=7200
     */
    'Alt-Svc'?: ResponseHeaderValue;
    /**
     * Tells all caching mechanisms from server to client whether they may cache this object. It is measured in seconds
     *
     * @example
     * Cache-Control: max-age=3600
     */
    'Cache-Control'?: ResponseHeaderValue;
    /**
     * Control options for the current connection and list of hop-by-hop response fields.            Must not be used with HTTP/2.[13]
     *
     * @example
     * Connection: close
     */
    'Connection'?: ResponseHeaderValue;
    /**
     * An opportunity to raise a "File Download" dialogue box for a known MIME type with binary format or suggest a filename for dynamic content. Quotes are necessary with special characters.
     *
     * @example
     * Content-Disposition: attachment; filename="fname.ext"
     */
    'Content-Disposition'?: ResponseHeaderValue;
    /**
     * The type of encoding used on the data. See HTTP compression.
     *
     * @example
     * Content-Encoding: gzip
     */
    'Content-Encoding'?: ResponseHeaderValue;
    /**
     * The natural language or languages of the intended audience for the enclosed content
     *
     * @example
     * Content-Language: da
     */
    'Content-Language'?: ResponseHeaderValue;
    /**
     * The length of the response body in octets (8-bit bytes)
     *
     * @example
     * Content-Length: 348
     */
    'Content-Length'?: ResponseHeaderValue;
    /**
     * An alternate location for the returned data
     *
     * @example
     * Content-Location: /index.htm
     */
    'Content-Location'?: ResponseHeaderValue;
    /**
     * A Base64-encoded binary MD5 sum of the content of the response
     *
     * @example
     * Content-MD5: Q2hlY2sgSW50ZWdyaXR5IQ==
     */
    'Content-MD5'?: ResponseHeaderValue;
    /**
     * Where in a full body message this partial message belongs
     *
     * @example
     * Content-Range: bytes 21010-47021/47022
     */
    'Content-Range'?: ResponseHeaderValue;
    /**
     * The MIME type of this content
     *
     * @example
     * Content-Type: text/html; charset=utf-8
     */
    'Content-Type'?: ResponseHeaderValue|MimeType;
    /**
     * The date and time that the message was sent (in "HTTP-date" format as defined by RFC 7231)
     *
     * @example
     * Date: Tue, 15 Nov 1994 08:12:31 GMT
     */
    'Date'?: ResponseHeaderValue;
    /**
     * Specifies the delta-encoding entity tag of the response.
     *
     * @example
     * Delta-Base: "abc"
     */
    'Delta-Base'?: ResponseHeaderValue;
    /**
     * An identifier for a specific version of a resource, often a message digest
     *
     * @example
     * ETag: "737060cd8c284d8af7ad3082f209582d"
     */
    'ETag'?: ResponseHeaderValue;
    /**
     * Gives the date/time after which the response is considered stale (in "HTTP-date" format as defined by RFC 7231)
     *
     * @example
     * Expires: Thu, 01 Dec 1994 16:00:00 GMT
     */
    'Expires'?: ResponseHeaderValue;
    /**
     * Instance-manipulations applied to the response.
     *
     * @example
     * IM: feed
     */
    'IM'?: ResponseHeaderValue;
    /**
     * The last modified date for the requested object (in "HTTP-date" format as defined by RFC 7231)
     *
     * @example
     * Last-Modified: Tue, 15 Nov 1994 12:45:26 GMT
     */
    'Last-Modified'?: ResponseHeaderValue;
    /**
     * Used to express a typed relationship with another resource, where the relation type is defined by RFC 5988
     *
     * @example
     * Link: </feed>; rel="alternate"
     */
    'Link'?: ResponseHeaderValue;
    /**
     * Used in redirection, or when a new resource has been created.
     *
     * @example
     * Example 1: Location: http://www.w3.org/pub/WWW/People.html                Example 2: Location: /pub/WWW/People.html
     */
    'Location'?: ResponseHeaderValue;
    /**
     * This field is supposed to set P3P policy, in the form of P3P:CP="your_compact_policy". However, P3P did not take off, most browsers have never fully implemented it, a lot of websites set this field with fake policy text, that was enough to fool browsers the existence of P3P policy and grant permissions for third party cookies.
     *
     * @example
     * P3P: CP="This is not a P3P policy! See https://en.wikipedia.org/wiki/Special:CentralAutoLogin/P3P for more info."
     */
    'P3P'?: ResponseHeaderValue;
    /**
     * Implementation-specific fields that may have various effects anywhere along the request-response chain.
     *
     * @example
     * Pragma: no-cache
     */
    'Pragma'?: ResponseHeaderValue;
    /**
     * Indicates which Prefer tokens were honored by the server and applied to the processing of the request.
     *
     * @example
     * Preference-Applied: return=representation
     */
    'Preference-Applied'?: ResponseHeaderValue;
    /**
     * Request authentication to access the proxy.
     *
     * @example
     * Proxy-Authenticate: Basic
     */
    'Proxy-Authenticate'?: ResponseHeaderValue;
    /**
     * HTTP Public Key Pinning, announces hash of website's authentic TLS certificate
     *
     * @example
     * Public-Key-Pins: max-age=2592000; pin-sha256="E9CZ9INDbd+2eRQozYqqbQ2yXLVKB9+xcprMF+44U1g=";
     */
    'Public-Key-Pins'?: ResponseHeaderValue;
    /**
     * If an entity is temporarily unavailable, this instructs the client to try again later. Value could be a specified period of time (in seconds) or a HTTP-date.
     *
     * @example
     * Example 1: Retry-After: 120                Example 2: Retry-After: Fri, 07 Nov 2014 23:59:59 GMT
     */
    'Retry-After'?: ResponseHeaderValue;
    /**
     * A name for the server
     *
     * @example
     * Server: Apache/2.4.1 (Unix)
     */
    'Server'?: ResponseHeaderValue;
    /**
     * An HTTP cookie
     *
     * @example
     * Set-Cookie: UserID=JohnDoe; Max-Age=3600; Version=1
     */
    'Set-Cookie'?: ResponseHeaderValue;
    /**
     * A HSTS Policy informing the HTTP client how long to cache the HTTPS only policy and whether this applies to subdomains.
     *
     * @example
     * Strict-Transport-Security: max-age=16070400; includeSubDomains
     */
    'Strict-Transport-Security'?: ResponseHeaderValue;
    /**
     * The Trailer general field value indicates that the given set of header fields is present in the trailer of a message encoded with chunked transfer coding.
     *
     * @example
     * Trailer: Max-Forwards
     */
    'Trailer'?: ResponseHeaderValue;
    /**
     * The form of encoding used to safely transfer the entity to the user. Currently defined methods are: chunked, compress, deflate, gzip, identity.            Must not be used with HTTP/2.
     *
     * @example
     * Transfer-Encoding: chunked
     */
    'Transfer-Encoding'?: ResponseHeaderValue;
    /**
     * Tracking Status header, value suggested to be sent in response to a DNT(do-not-track), possible values:            "!" — under construction"?" — dynamic"G" — gateway to multiple parties"N" — not tracking"T" — tracking"C" — tracking with consent"P" — tracking only if consented"D" — disregarding DNT"U" — updated
     *
     * @example
     * Tk: ?
     */
    'Tk'?: ResponseHeaderValue;
    /**
     * Ask the client to upgrade to another protocol.            Must not be used in HTTP/2
     *
     * @example
     * Upgrade: h2c, HTTPS/1.3, IRC/6.9, RTA/x11, websocket
     */
    'Upgrade'?: ResponseHeaderValue;
    /**
     * Tells downstream proxies how to match future request headers to decide whether the cached response can be used rather than requesting a fresh one from the origin server.
     *
     * @example
     * Example 1: Vary: *                Example 2: Vary: Accept-Language
     */
    'Vary'?: ResponseHeaderValue;
    /**
     * Informs the client of proxies through which the response was sent.
     *
     * @example
     * Via: 1.0 fred, 1.1 example.com (Apache/1.1)
     */
    'Via'?: ResponseHeaderValue;
    /**
     * A general warning about possible problems with the entity body.
     *
     * @example
     * Warning: 199 Miscellaneous warning
     */
    'Warning'?: ResponseHeaderValue;
    /**
     * Indicates the authentication scheme that should be used to access the requested entity.
     *
     * @example
     * WWW-Authenticate: Basic
     */
    'WWW-Authenticate'?: ResponseHeaderValue;
    /**
     * Clickjacking protection: deny - no rendering within a frame, sameorigin - no rendering if origin mismatch, allow-from - allow from specified location, allowall - non-standard, allow from any location
     *
     * @example
     * X-Frame-Options: deny
     */
    'X-Frame-Options'?: ResponseHeaderValue;

}

export interface NonStandardResponseHeaders {
    /**
     * Content Security Policy definition.
     *
     * @example
     * X-WebKit-CSP: default-src 'self'
     */
    'Content-Security-Policy,X-Content-Security-Policy,X-WebKit-CSP'?: ResponseHeaderValue;
    /**
     * Notify to prefer to enforce Certificate Transparency.
     *
     * @example
     * Expect-CT: max-age=604800, enforce, report-uri="https://example.example/report"
     */
    'Expect-CT'?: ResponseHeaderValue;
    /**
     * Used to configure network request logging.
     *
     * @example
     * NEL: { "report_to": "name_of_reporting_group", "max_age": 12345, "include_subdomains": false, "success_fraction": 0.0, "failure_fraction": 1.0 }
     */
    'NEL'?: ResponseHeaderValue;
    /**
     * To allow or disable different features or APIs of the browser.
     *
     * @example
     * Permissions-Policy: fullscreen=(), camera=(), microphone=(), geolocation=(), interest-cohort=()
     */
    'Permissions-Policy'?: ResponseHeaderValue;
    /**
     * Used in redirection, or when a new resource has been created. This refresh redirects after 5 seconds. Header extension introduced by Netscape and supported by most web browsers. Defined by HTML Standard
     *
     * @example
     * Refresh: 5; url=http://www.w3.org/pub/WWW/People.html
     */
    'Refresh'?: ResponseHeaderValue;
    /**
     * Instructs the user agent to store reporting endpoints for an origin.
     *
     * @example
     * Report-To: { "group": "csp-endpoint", "max_age": 10886400, "endpoints": [ { "url": "https-url-of-site-which-collects-reports" } ] }
     */
    'Report-To'?: ResponseHeaderValue;
    /**
     * CGI header field specifying the status of the HTTP response. Normal HTTP responses use a separate "Status-Line" instead, defined by RFC 7230.
     *
     * @example
     * Status: 200 OK
     */
    'Status'?: ResponseHeaderValue;
    /**
     * The Timing-Allow-Origin response header specifies origins that are allowed to see values of attributes retrieved via features of the Resource Timing API, which would otherwise be reported as zero due to cross-origin restrictions.
     *
     * @example
     * Timing-Allow-Origin: *            Timing-Allow-Origin: <origin>[, <origin>]*
     */
    'Timing-Allow-Origin'?: ResponseHeaderValue;
    /**
     * Provide the duration of the audio or video in seconds; only supported by Gecko browsers
     *
     * @example
     * X-Content-Duration: 42.666
     */
    'X-Content-Duration'?: ResponseHeaderValue;
    /**
     * The only defined value, "nosniff", prevents Internet Explorer from MIME-sniffing a response away from the declared content-type. This also applies to Google Chrome, when downloading extensions.
     *
     * @example
     * X-Content-Type-Options: nosniff
     */
    'X-Content-Type-Options'?: ResponseHeaderValue;
    /**
     * Specifies the technology (e.g. ASP.NET, PHP, JBoss) supporting the web application (version details are often in X-Runtime, X-Version, or X-AspNet-Version)
     *
     * @example
     * X-Powered-By: PHP/5.4.0
     */
    'X-Powered-By'?: ResponseHeaderValue;
    /**
     * Specifies the component that is responsible for a particular redirect.
     *
     * @example
     * X-Redirect-By: WordPressX-Redirect-By: Polylang
     */
    'X-Redirect-By'?: ResponseHeaderValue;
    /**
     * Correlates HTTP requests between a client and server.
     *
     * @example
     * X-Request-ID: f058ebd6-02f7-4d3f-942e-904344e8cde5
     */
    'X-Request-ID,X-Correlation-ID'?: ResponseHeaderValue;
    /**
     * Recommends the preferred rendering engine (often a backward-compatibility mode) to use to display the content. Also used to activate Chrome Frame in Internet Explorer. In HTML Standard, only the IE=edge value is defined.
     *
     * @example
     * X-UA-Compatible: IE=edgeX-UA-Compatible: IE=EmulateIE7X-UA-Compatible: Chrome=1
     */
    'X-UA-Compatible'?: ResponseHeaderValue;
    /**
     * Cross-site scripting (XSS) filter
     *
     * @example
     * X-XSS-Protection: 1; mode=block
     */
    'X-XSS-Protection'?: ResponseHeaderValue;

}

export type RequestHeaders =
    StandardRequestHeaders
    & NonStandardRequestHeaders
export type ResponseHeaders =
    StandardResponseHeaders
    & NonStandardResponseHeaders
export type RequestHeader =
    keyof StandardRequestHeaders
    | keyof NonStandardRequestHeaders
export type ResponseHeader =
    keyof StandardResponseHeaders
    | keyof NonStandardResponseHeaders
export type AllHeaders =
    StandardRequestHeaders
    | NonStandardRequestHeaders
    | StandardResponseHeaders
    | NonStandardResponseHeaders
export type AnyHeader =
    keyof StandardRequestHeaders
    | keyof NonStandardRequestHeaders
    | keyof StandardResponseHeaders
    | keyof NonStandardResponseHeaders
    | string

export type CombinedHeaders =
    StandardRequestHeaders
    & NonStandardRequestHeaders
    & StandardResponseHeaders
    & NonStandardResponseHeaders
