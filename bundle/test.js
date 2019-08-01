/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/test/test_entry.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/rtcpeerconnection-shim/rtcpeerconnection.js":
/*!******************************************************************!*\
  !*** ./node_modules/rtcpeerconnection-shim/rtcpeerconnection.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(/*! sdp */ "./node_modules/sdp/sdp.js");

function fixStatsType(stat) {
  return {
    inboundrtp: 'inbound-rtp',
    outboundrtp: 'outbound-rtp',
    candidatepair: 'candidate-pair',
    localcandidate: 'local-candidate',
    remotecandidate: 'remote-candidate'
  }[stat.type] || stat.type;
}

function writeMediaSection(transceiver, caps, type, stream, dtlsRole) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : dtlsRole || 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    var trackId = transceiver.rtpSender._initialTrackId ||
        transceiver.rtpSender.track.id;
    transceiver.rtpSender._initialTrackId = trackId;
    // spec.
    var msid = 'msid:' + (stream ? stream.id : '-') + ' ' +
        trackId + '\r\n';
    sdp += 'a=' + msid;
    // for Chrome. Legacy should no longer be required.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;

    // RTX
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
}

// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
function filterIceServers(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        console.warn('RTCIceServer.url is deprecated! Use urls instead.');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
}

// Determines the intersection of local and remote capabilities.
function getCommonCapabilities(localCapabilities, remoteCapabilities) {
  var commonCapabilities = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: []
  };

  var findCodecByPayloadType = function(pt, codecs) {
    pt = parseInt(pt, 10);
    for (var i = 0; i < codecs.length; i++) {
      if (codecs[i].payloadType === pt ||
          codecs[i].preferredPayloadType === pt) {
        return codecs[i];
      }
    }
  };

  var rtxCapabilityMatches = function(lRtx, rRtx, lCodecs, rCodecs) {
    var lCodec = findCodecByPayloadType(lRtx.parameters.apt, lCodecs);
    var rCodec = findCodecByPayloadType(rRtx.parameters.apt, rCodecs);
    return lCodec && rCodec &&
        lCodec.name.toLowerCase() === rCodec.name.toLowerCase();
  };

  localCapabilities.codecs.forEach(function(lCodec) {
    for (var i = 0; i < remoteCapabilities.codecs.length; i++) {
      var rCodec = remoteCapabilities.codecs[i];
      if (lCodec.name.toLowerCase() === rCodec.name.toLowerCase() &&
          lCodec.clockRate === rCodec.clockRate) {
        if (lCodec.name.toLowerCase() === 'rtx' &&
            lCodec.parameters && rCodec.parameters.apt) {
          // for RTX we need to find the local rtx that has a apt
          // which points to the same local codec as the remote one.
          if (!rtxCapabilityMatches(lCodec, rCodec,
              localCapabilities.codecs, remoteCapabilities.codecs)) {
            continue;
          }
        }
        rCodec = JSON.parse(JSON.stringify(rCodec)); // deepcopy
        // number of channels is the highest common number of channels
        rCodec.numChannels = Math.min(lCodec.numChannels,
            rCodec.numChannels);
        // push rCodec so we reply with offerer payload type
        commonCapabilities.codecs.push(rCodec);

        // determine common feedback mechanisms
        rCodec.rtcpFeedback = rCodec.rtcpFeedback.filter(function(fb) {
          for (var j = 0; j < lCodec.rtcpFeedback.length; j++) {
            if (lCodec.rtcpFeedback[j].type === fb.type &&
                lCodec.rtcpFeedback[j].parameter === fb.parameter) {
              return true;
            }
          }
          return false;
        });
        // FIXME: also need to determine .parameters
        //  see https://github.com/openpeer/ortc/issues/569
        break;
      }
    }
  });

  localCapabilities.headerExtensions.forEach(function(lHeaderExtension) {
    for (var i = 0; i < remoteCapabilities.headerExtensions.length;
         i++) {
      var rHeaderExtension = remoteCapabilities.headerExtensions[i];
      if (lHeaderExtension.uri === rHeaderExtension.uri) {
        commonCapabilities.headerExtensions.push(rHeaderExtension);
        break;
      }
    }
  });

  // FIXME: fecMechanisms
  return commonCapabilities;
}

// is action=setLocalDescription with type allowed in signalingState
function isActionAllowedInSignalingState(action, type, signalingState) {
  return {
    offer: {
      setLocalDescription: ['stable', 'have-local-offer'],
      setRemoteDescription: ['stable', 'have-remote-offer']
    },
    answer: {
      setLocalDescription: ['have-remote-offer', 'have-local-pranswer'],
      setRemoteDescription: ['have-local-offer', 'have-remote-pranswer']
    }
  }[type][action].indexOf(signalingState) !== -1;
}

function maybeAddCandidate(iceTransport, candidate) {
  // Edge's internal representation adds some fields therefore
  // not all fieldѕ are taken into account.
  var alreadyAdded = iceTransport.getRemoteCandidates()
      .find(function(remoteCandidate) {
        return candidate.foundation === remoteCandidate.foundation &&
            candidate.ip === remoteCandidate.ip &&
            candidate.port === remoteCandidate.port &&
            candidate.priority === remoteCandidate.priority &&
            candidate.protocol === remoteCandidate.protocol &&
            candidate.type === remoteCandidate.type;
      });
  if (!alreadyAdded) {
    iceTransport.addRemoteCandidate(candidate);
  }
  return !alreadyAdded;
}


function makeError(name, description) {
  var e = new Error(description);
  e.name = name;
  // legacy error codes from https://heycam.github.io/webidl/#idl-DOMException-error-names
  e.code = {
    NotSupportedError: 9,
    InvalidStateError: 11,
    InvalidAccessError: 15,
    TypeError: undefined,
    OperationError: undefined
  }[name];
  return e;
}

module.exports = function(window, edgeVersion) {
  // https://w3c.github.io/mediacapture-main/#mediastream
  // Helper function to add the track to the stream and
  // dispatch the event ourselves.
  function addTrackToStreamAndFireEvent(track, stream) {
    stream.addTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('addtrack',
        {track: track}));
  }

  function removeTrackFromStreamAndFireEvent(track, stream) {
    stream.removeTrack(track);
    stream.dispatchEvent(new window.MediaStreamTrackEvent('removetrack',
        {track: track}));
  }

  function fireAddTrack(pc, track, receiver, streams) {
    var trackEvent = new Event('track');
    trackEvent.track = track;
    trackEvent.receiver = receiver;
    trackEvent.transceiver = {receiver: receiver};
    trackEvent.streams = streams;
    window.setTimeout(function() {
      pc._dispatchEvent('track', trackEvent);
    });
  }

  var RTCPeerConnection = function(config) {
    var pc = this;

    var _eventTarget = document.createDocumentFragment();
    ['addEventListener', 'removeEventListener', 'dispatchEvent']
        .forEach(function(method) {
          pc[method] = _eventTarget[method].bind(_eventTarget);
        });

    this.canTrickleIceCandidates = null;

    this.needNegotiation = false;

    this.localStreams = [];
    this.remoteStreams = [];

    this._localDescription = null;
    this._remoteDescription = null;

    this.signalingState = 'stable';
    this.iceConnectionState = 'new';
    this.connectionState = 'new';
    this.iceGatheringState = 'new';

    config = JSON.parse(JSON.stringify(config || {}));

    this.usingBundle = config.bundlePolicy === 'max-bundle';
    if (config.rtcpMuxPolicy === 'negotiate') {
      throw(makeError('NotSupportedError',
          'rtcpMuxPolicy \'negotiate\' is not supported'));
    } else if (!config.rtcpMuxPolicy) {
      config.rtcpMuxPolicy = 'require';
    }

    switch (config.iceTransportPolicy) {
      case 'all':
      case 'relay':
        break;
      default:
        config.iceTransportPolicy = 'all';
        break;
    }

    switch (config.bundlePolicy) {
      case 'balanced':
      case 'max-compat':
      case 'max-bundle':
        break;
      default:
        config.bundlePolicy = 'balanced';
        break;
    }

    config.iceServers = filterIceServers(config.iceServers || [], edgeVersion);

    this._iceGatherers = [];
    if (config.iceCandidatePoolSize) {
      for (var i = config.iceCandidatePoolSize; i > 0; i--) {
        this._iceGatherers.push(new window.RTCIceGatherer({
          iceServers: config.iceServers,
          gatherPolicy: config.iceTransportPolicy
        }));
      }
    } else {
      config.iceCandidatePoolSize = 0;
    }

    this._config = config;

    // per-track iceGathers, iceTransports, dtlsTransports, rtpSenders, ...
    // everything that is needed to describe a SDP m-line.
    this.transceivers = [];

    this._sdpSessionId = SDPUtils.generateSessionId();
    this._sdpSessionVersion = 0;

    this._dtlsRole = undefined; // role for a=setup to use in answers.

    this._isClosed = false;
  };

  Object.defineProperty(RTCPeerConnection.prototype, 'localDescription', {
    configurable: true,
    get: function() {
      return this._localDescription;
    }
  });
  Object.defineProperty(RTCPeerConnection.prototype, 'remoteDescription', {
    configurable: true,
    get: function() {
      return this._remoteDescription;
    }
  });

  // set up event handlers on prototype
  RTCPeerConnection.prototype.onicecandidate = null;
  RTCPeerConnection.prototype.onaddstream = null;
  RTCPeerConnection.prototype.ontrack = null;
  RTCPeerConnection.prototype.onremovestream = null;
  RTCPeerConnection.prototype.onsignalingstatechange = null;
  RTCPeerConnection.prototype.oniceconnectionstatechange = null;
  RTCPeerConnection.prototype.onconnectionstatechange = null;
  RTCPeerConnection.prototype.onicegatheringstatechange = null;
  RTCPeerConnection.prototype.onnegotiationneeded = null;
  RTCPeerConnection.prototype.ondatachannel = null;

  RTCPeerConnection.prototype._dispatchEvent = function(name, event) {
    if (this._isClosed) {
      return;
    }
    this.dispatchEvent(event);
    if (typeof this['on' + name] === 'function') {
      this['on' + name](event);
    }
  };

  RTCPeerConnection.prototype._emitGatheringStateChange = function() {
    var event = new Event('icegatheringstatechange');
    this._dispatchEvent('icegatheringstatechange', event);
  };

  RTCPeerConnection.prototype.getConfiguration = function() {
    return this._config;
  };

  RTCPeerConnection.prototype.getLocalStreams = function() {
    return this.localStreams;
  };

  RTCPeerConnection.prototype.getRemoteStreams = function() {
    return this.remoteStreams;
  };

  // internal helper to create a transceiver object.
  // (which is not yet the same as the WebRTC 1.0 transceiver)
  RTCPeerConnection.prototype._createTransceiver = function(kind, doNotAdd) {
    var hasBundleTransport = this.transceivers.length > 0;
    var transceiver = {
      track: null,
      iceGatherer: null,
      iceTransport: null,
      dtlsTransport: null,
      localCapabilities: null,
      remoteCapabilities: null,
      rtpSender: null,
      rtpReceiver: null,
      kind: kind,
      mid: null,
      sendEncodingParameters: null,
      recvEncodingParameters: null,
      stream: null,
      associatedRemoteMediaStreams: [],
      wantReceive: true
    };
    if (this.usingBundle && hasBundleTransport) {
      transceiver.iceTransport = this.transceivers[0].iceTransport;
      transceiver.dtlsTransport = this.transceivers[0].dtlsTransport;
    } else {
      var transports = this._createIceAndDtlsTransports();
      transceiver.iceTransport = transports.iceTransport;
      transceiver.dtlsTransport = transports.dtlsTransport;
    }
    if (!doNotAdd) {
      this.transceivers.push(transceiver);
    }
    return transceiver;
  };

  RTCPeerConnection.prototype.addTrack = function(track, stream) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call addTrack on a closed peerconnection.');
    }

    var alreadyExists = this.transceivers.find(function(s) {
      return s.track === track;
    });

    if (alreadyExists) {
      throw makeError('InvalidAccessError', 'Track already exists.');
    }

    var transceiver;
    for (var i = 0; i < this.transceivers.length; i++) {
      if (!this.transceivers[i].track &&
          this.transceivers[i].kind === track.kind) {
        transceiver = this.transceivers[i];
      }
    }
    if (!transceiver) {
      transceiver = this._createTransceiver(track.kind);
    }

    this._maybeFireNegotiationNeeded();

    if (this.localStreams.indexOf(stream) === -1) {
      this.localStreams.push(stream);
    }

    transceiver.track = track;
    transceiver.stream = stream;
    transceiver.rtpSender = new window.RTCRtpSender(track,
        transceiver.dtlsTransport);
    return transceiver.rtpSender;
  };

  RTCPeerConnection.prototype.addStream = function(stream) {
    var pc = this;
    if (edgeVersion >= 15025) {
      stream.getTracks().forEach(function(track) {
        pc.addTrack(track, stream);
      });
    } else {
      // Clone is necessary for local demos mostly, attaching directly
      // to two different senders does not work (build 10547).
      // Fixed in 15025 (or earlier)
      var clonedStream = stream.clone();
      stream.getTracks().forEach(function(track, idx) {
        var clonedTrack = clonedStream.getTracks()[idx];
        track.addEventListener('enabled', function(event) {
          clonedTrack.enabled = event.enabled;
        });
      });
      clonedStream.getTracks().forEach(function(track) {
        pc.addTrack(track, clonedStream);
      });
    }
  };

  RTCPeerConnection.prototype.removeTrack = function(sender) {
    if (this._isClosed) {
      throw makeError('InvalidStateError',
          'Attempted to call removeTrack on a closed peerconnection.');
    }

    if (!(sender instanceof window.RTCRtpSender)) {
      throw new TypeError('Argument 1 of RTCPeerConnection.removeTrack ' +
          'does not implement interface RTCRtpSender.');
    }

    var transceiver = this.transceivers.find(function(t) {
      return t.rtpSender === sender;
    });

    if (!transceiver) {
      throw makeError('InvalidAccessError',
          'Sender was not created by this connection.');
    }
    var stream = transceiver.stream;

    transceiver.rtpSender.stop();
    transceiver.rtpSender = null;
    transceiver.track = null;
    transceiver.stream = null;

    // remove the stream from the set of local streams
    var localStreams = this.transceivers.map(function(t) {
      return t.stream;
    });
    if (localStreams.indexOf(stream) === -1 &&
        this.localStreams.indexOf(stream) > -1) {
      this.localStreams.splice(this.localStreams.indexOf(stream), 1);
    }

    this._maybeFireNegotiationNeeded();
  };

  RTCPeerConnection.prototype.removeStream = function(stream) {
    var pc = this;
    stream.getTracks().forEach(function(track) {
      var sender = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (sender) {
        pc.removeTrack(sender);
      }
    });
  };

  RTCPeerConnection.prototype.getSenders = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpSender;
    })
    .map(function(transceiver) {
      return transceiver.rtpSender;
    });
  };

  RTCPeerConnection.prototype.getReceivers = function() {
    return this.transceivers.filter(function(transceiver) {
      return !!transceiver.rtpReceiver;
    })
    .map(function(transceiver) {
      return transceiver.rtpReceiver;
    });
  };


  RTCPeerConnection.prototype._createIceGatherer = function(sdpMLineIndex,
      usingBundle) {
    var pc = this;
    if (usingBundle && sdpMLineIndex > 0) {
      return this.transceivers[0].iceGatherer;
    } else if (this._iceGatherers.length) {
      return this._iceGatherers.shift();
    }
    var iceGatherer = new window.RTCIceGatherer({
      iceServers: this._config.iceServers,
      gatherPolicy: this._config.iceTransportPolicy
    });
    Object.defineProperty(iceGatherer, 'state',
        {value: 'new', writable: true}
    );

    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = [];
    this.transceivers[sdpMLineIndex].bufferCandidates = function(event) {
      var end = !event.candidate || Object.keys(event.candidate).length === 0;
      // polyfill since RTCIceGatherer.state is not implemented in
      // Edge 10547 yet.
      iceGatherer.state = end ? 'completed' : 'gathering';
      if (pc.transceivers[sdpMLineIndex].bufferedCandidateEvents !== null) {
        pc.transceivers[sdpMLineIndex].bufferedCandidateEvents.push(event);
      }
    };
    iceGatherer.addEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    return iceGatherer;
  };

  // start gathering from an RTCIceGatherer.
  RTCPeerConnection.prototype._gather = function(mid, sdpMLineIndex) {
    var pc = this;
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer.onlocalcandidate) {
      return;
    }
    var bufferedCandidateEvents =
      this.transceivers[sdpMLineIndex].bufferedCandidateEvents;
    this.transceivers[sdpMLineIndex].bufferedCandidateEvents = null;
    iceGatherer.removeEventListener('localcandidate',
      this.transceivers[sdpMLineIndex].bufferCandidates);
    iceGatherer.onlocalcandidate = function(evt) {
      if (pc.usingBundle && sdpMLineIndex > 0) {
        // if we know that we use bundle we can drop candidates with
        // ѕdpMLineIndex > 0. If we don't do this then our state gets
        // confused since we dispose the extra ice gatherer.
        return;
      }
      var event = new Event('icecandidate');
      event.candidate = {sdpMid: mid, sdpMLineIndex: sdpMLineIndex};

      var cand = evt.candidate;
      // Edge emits an empty object for RTCIceCandidateComplete‥
      var end = !cand || Object.keys(cand).length === 0;
      if (end) {
        // polyfill since RTCIceGatherer.state is not implemented in
        // Edge 10547 yet.
        if (iceGatherer.state === 'new' || iceGatherer.state === 'gathering') {
          iceGatherer.state = 'completed';
        }
      } else {
        if (iceGatherer.state === 'new') {
          iceGatherer.state = 'gathering';
        }
        // RTCIceCandidate doesn't have a component, needs to be added
        cand.component = 1;
        // also the usernameFragment. TODO: update SDP to take both variants.
        cand.ufrag = iceGatherer.getLocalParameters().usernameFragment;

        var serializedCandidate = SDPUtils.writeCandidate(cand);
        event.candidate = Object.assign(event.candidate,
            SDPUtils.parseCandidate(serializedCandidate));

        event.candidate.candidate = serializedCandidate;
        event.candidate.toJSON = function() {
          return {
            candidate: event.candidate.candidate,
            sdpMid: event.candidate.sdpMid,
            sdpMLineIndex: event.candidate.sdpMLineIndex,
            usernameFragment: event.candidate.usernameFragment
          };
        };
      }

      // update local description.
      var sections = SDPUtils.getMediaSections(pc._localDescription.sdp);
      if (!end) {
        sections[event.candidate.sdpMLineIndex] +=
            'a=' + event.candidate.candidate + '\r\n';
      } else {
        sections[event.candidate.sdpMLineIndex] +=
            'a=end-of-candidates\r\n';
      }
      pc._localDescription.sdp =
          SDPUtils.getDescription(pc._localDescription.sdp) +
          sections.join('');
      var complete = pc.transceivers.every(function(transceiver) {
        return transceiver.iceGatherer &&
            transceiver.iceGatherer.state === 'completed';
      });

      if (pc.iceGatheringState !== 'gathering') {
        pc.iceGatheringState = 'gathering';
        pc._emitGatheringStateChange();
      }

      // Emit candidate. Also emit null candidate when all gatherers are
      // complete.
      if (!end) {
        pc._dispatchEvent('icecandidate', event);
      }
      if (complete) {
        pc._dispatchEvent('icecandidate', new Event('icecandidate'));
        pc.iceGatheringState = 'complete';
        pc._emitGatheringStateChange();
      }
    };

    // emit already gathered candidates.
    window.setTimeout(function() {
      bufferedCandidateEvents.forEach(function(e) {
        iceGatherer.onlocalcandidate(e);
      });
    }, 0);
  };

  // Create ICE transport and DTLS transport.
  RTCPeerConnection.prototype._createIceAndDtlsTransports = function() {
    var pc = this;
    var iceTransport = new window.RTCIceTransport(null);
    iceTransport.onicestatechange = function() {
      pc._updateIceConnectionState();
      pc._updateConnectionState();
    };

    var dtlsTransport = new window.RTCDtlsTransport(iceTransport);
    dtlsTransport.ondtlsstatechange = function() {
      pc._updateConnectionState();
    };
    dtlsTransport.onerror = function() {
      // onerror does not set state to failed by itself.
      Object.defineProperty(dtlsTransport, 'state',
          {value: 'failed', writable: true});
      pc._updateConnectionState();
    };

    return {
      iceTransport: iceTransport,
      dtlsTransport: dtlsTransport
    };
  };

  // Destroy ICE gatherer, ICE transport and DTLS transport.
  // Without triggering the callbacks.
  RTCPeerConnection.prototype._disposeIceAndDtlsTransports = function(
      sdpMLineIndex) {
    var iceGatherer = this.transceivers[sdpMLineIndex].iceGatherer;
    if (iceGatherer) {
      delete iceGatherer.onlocalcandidate;
      delete this.transceivers[sdpMLineIndex].iceGatherer;
    }
    var iceTransport = this.transceivers[sdpMLineIndex].iceTransport;
    if (iceTransport) {
      delete iceTransport.onicestatechange;
      delete this.transceivers[sdpMLineIndex].iceTransport;
    }
    var dtlsTransport = this.transceivers[sdpMLineIndex].dtlsTransport;
    if (dtlsTransport) {
      delete dtlsTransport.ondtlsstatechange;
      delete dtlsTransport.onerror;
      delete this.transceivers[sdpMLineIndex].dtlsTransport;
    }
  };

  // Start the RTP Sender and Receiver for a transceiver.
  RTCPeerConnection.prototype._transceive = function(transceiver,
      send, recv) {
    var params = getCommonCapabilities(transceiver.localCapabilities,
        transceiver.remoteCapabilities);
    if (send && transceiver.rtpSender) {
      params.encodings = transceiver.sendEncodingParameters;
      params.rtcp = {
        cname: SDPUtils.localCName,
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.recvEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.recvEncodingParameters[0].ssrc;
      }
      transceiver.rtpSender.send(params);
    }
    if (recv && transceiver.rtpReceiver && params.codecs.length > 0) {
      // remove RTX field in Edge 14942
      if (transceiver.kind === 'video'
          && transceiver.recvEncodingParameters
          && edgeVersion < 15019) {
        transceiver.recvEncodingParameters.forEach(function(p) {
          delete p.rtx;
        });
      }
      if (transceiver.recvEncodingParameters.length) {
        params.encodings = transceiver.recvEncodingParameters;
      } else {
        params.encodings = [{}];
      }
      params.rtcp = {
        compound: transceiver.rtcpParameters.compound
      };
      if (transceiver.rtcpParameters.cname) {
        params.rtcp.cname = transceiver.rtcpParameters.cname;
      }
      if (transceiver.sendEncodingParameters.length) {
        params.rtcp.ssrc = transceiver.sendEncodingParameters[0].ssrc;
      }
      transceiver.rtpReceiver.receive(params);
    }
  };

  RTCPeerConnection.prototype.setLocalDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setLocalDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set local ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var sections;
    var sessionpart;
    if (description.type === 'offer') {
      // VERY limited support for SDP munging. Limited to:
      // * changing the order of codecs
      sections = SDPUtils.splitSections(description.sdp);
      sessionpart = sections.shift();
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var caps = SDPUtils.parseRtpParameters(mediaSection);
        pc.transceivers[sdpMLineIndex].localCapabilities = caps;
      });

      pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
        pc._gather(transceiver.mid, sdpMLineIndex);
      });
    } else if (description.type === 'answer') {
      sections = SDPUtils.splitSections(pc._remoteDescription.sdp);
      sessionpart = sections.shift();
      var isIceLite = SDPUtils.matchPrefix(sessionpart,
          'a=ice-lite').length > 0;
      sections.forEach(function(mediaSection, sdpMLineIndex) {
        var transceiver = pc.transceivers[sdpMLineIndex];
        var iceGatherer = transceiver.iceGatherer;
        var iceTransport = transceiver.iceTransport;
        var dtlsTransport = transceiver.dtlsTransport;
        var localCapabilities = transceiver.localCapabilities;
        var remoteCapabilities = transceiver.remoteCapabilities;

        // treat bundle-only as not-rejected.
        var rejected = SDPUtils.isRejected(mediaSection) &&
            SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;

        if (!rejected && !transceiver.rejected) {
          var remoteIceParameters = SDPUtils.getIceParameters(
              mediaSection, sessionpart);
          var remoteDtlsParameters = SDPUtils.getDtlsParameters(
              mediaSection, sessionpart);
          if (isIceLite) {
            remoteDtlsParameters.role = 'server';
          }

          if (!pc.usingBundle || sdpMLineIndex === 0) {
            pc._gather(transceiver.mid, sdpMLineIndex);
            if (iceTransport.state === 'new') {
              iceTransport.start(iceGatherer, remoteIceParameters,
                  isIceLite ? 'controlling' : 'controlled');
            }
            if (dtlsTransport.state === 'new') {
              dtlsTransport.start(remoteDtlsParameters);
            }
          }

          // Calculate intersection of capabilities.
          var params = getCommonCapabilities(localCapabilities,
              remoteCapabilities);

          // Start the RTCRtpSender. The RTCRtpReceiver for this
          // transceiver has already been started in setRemoteDescription.
          pc._transceive(transceiver,
              params.codecs.length > 0,
              false);
        }
      });
    }

    pc._localDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-local-offer');
    } else {
      pc._updateSignalingState('stable');
    }

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.setRemoteDescription = function(description) {
    var pc = this;

    // Note: pranswer is not supported.
    if (['offer', 'answer'].indexOf(description.type) === -1) {
      return Promise.reject(makeError('TypeError',
          'Unsupported type "' + description.type + '"'));
    }

    if (!isActionAllowedInSignalingState('setRemoteDescription',
        description.type, pc.signalingState) || pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not set remote ' + description.type +
          ' in state ' + pc.signalingState));
    }

    var streams = {};
    pc.remoteStreams.forEach(function(stream) {
      streams[stream.id] = stream;
    });
    var receiverList = [];
    var sections = SDPUtils.splitSections(description.sdp);
    var sessionpart = sections.shift();
    var isIceLite = SDPUtils.matchPrefix(sessionpart,
        'a=ice-lite').length > 0;
    var usingBundle = SDPUtils.matchPrefix(sessionpart,
        'a=group:BUNDLE ').length > 0;
    pc.usingBundle = usingBundle;
    var iceOptions = SDPUtils.matchPrefix(sessionpart,
        'a=ice-options:')[0];
    if (iceOptions) {
      pc.canTrickleIceCandidates = iceOptions.substr(14).split(' ')
          .indexOf('trickle') >= 0;
    } else {
      pc.canTrickleIceCandidates = false;
    }

    sections.forEach(function(mediaSection, sdpMLineIndex) {
      var lines = SDPUtils.splitLines(mediaSection);
      var kind = SDPUtils.getKind(mediaSection);
      // treat bundle-only as not-rejected.
      var rejected = SDPUtils.isRejected(mediaSection) &&
          SDPUtils.matchPrefix(mediaSection, 'a=bundle-only').length === 0;
      var protocol = lines[0].substr(2).split(' ')[2];

      var direction = SDPUtils.getDirection(mediaSection, sessionpart);
      var remoteMsid = SDPUtils.parseMsid(mediaSection);

      var mid = SDPUtils.getMid(mediaSection) || SDPUtils.generateIdentifier();

      // Reject datachannels which are not implemented yet.
      if (rejected || (kind === 'application' && (protocol === 'DTLS/SCTP' ||
          protocol === 'UDP/DTLS/SCTP'))) {
        // TODO: this is dangerous in the case where a non-rejected m-line
        //     becomes rejected.
        pc.transceivers[sdpMLineIndex] = {
          mid: mid,
          kind: kind,
          protocol: protocol,
          rejected: true
        };
        return;
      }

      if (!rejected && pc.transceivers[sdpMLineIndex] &&
          pc.transceivers[sdpMLineIndex].rejected) {
        // recycle a rejected transceiver.
        pc.transceivers[sdpMLineIndex] = pc._createTransceiver(kind, true);
      }

      var transceiver;
      var iceGatherer;
      var iceTransport;
      var dtlsTransport;
      var rtpReceiver;
      var sendEncodingParameters;
      var recvEncodingParameters;
      var localCapabilities;

      var track;
      // FIXME: ensure the mediaSection has rtcp-mux set.
      var remoteCapabilities = SDPUtils.parseRtpParameters(mediaSection);
      var remoteIceParameters;
      var remoteDtlsParameters;
      if (!rejected) {
        remoteIceParameters = SDPUtils.getIceParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters = SDPUtils.getDtlsParameters(mediaSection,
            sessionpart);
        remoteDtlsParameters.role = 'client';
      }
      recvEncodingParameters =
          SDPUtils.parseRtpEncodingParameters(mediaSection);

      var rtcpParameters = SDPUtils.parseRtcpParameters(mediaSection);

      var isComplete = SDPUtils.matchPrefix(mediaSection,
          'a=end-of-candidates', sessionpart).length > 0;
      var cands = SDPUtils.matchPrefix(mediaSection, 'a=candidate:')
          .map(function(cand) {
            return SDPUtils.parseCandidate(cand);
          })
          .filter(function(cand) {
            return cand.component === 1;
          });

      // Check if we can use BUNDLE and dispose transports.
      if ((description.type === 'offer' || description.type === 'answer') &&
          !rejected && usingBundle && sdpMLineIndex > 0 &&
          pc.transceivers[sdpMLineIndex]) {
        pc._disposeIceAndDtlsTransports(sdpMLineIndex);
        pc.transceivers[sdpMLineIndex].iceGatherer =
            pc.transceivers[0].iceGatherer;
        pc.transceivers[sdpMLineIndex].iceTransport =
            pc.transceivers[0].iceTransport;
        pc.transceivers[sdpMLineIndex].dtlsTransport =
            pc.transceivers[0].dtlsTransport;
        if (pc.transceivers[sdpMLineIndex].rtpSender) {
          pc.transceivers[sdpMLineIndex].rtpSender.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
        if (pc.transceivers[sdpMLineIndex].rtpReceiver) {
          pc.transceivers[sdpMLineIndex].rtpReceiver.setTransport(
              pc.transceivers[0].dtlsTransport);
        }
      }
      if (description.type === 'offer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex] ||
            pc._createTransceiver(kind);
        transceiver.mid = mid;

        if (!transceiver.iceGatherer) {
          transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
              usingBundle);
        }

        if (cands.length && transceiver.iceTransport.state === 'new') {
          if (isComplete && (!usingBundle || sdpMLineIndex === 0)) {
            transceiver.iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        localCapabilities = window.RTCRtpReceiver.getCapabilities(kind);

        // filter RTX until additional stuff needed for RTX is implemented
        // in adapter.js
        if (edgeVersion < 15019) {
          localCapabilities.codecs = localCapabilities.codecs.filter(
              function(codec) {
                return codec.name !== 'rtx';
              });
        }

        sendEncodingParameters = transceiver.sendEncodingParameters || [{
          ssrc: (2 * sdpMLineIndex + 2) * 1001
        }];

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        var isNewTrack = false;
        if (direction === 'sendrecv' || direction === 'sendonly') {
          isNewTrack = !transceiver.rtpReceiver;
          rtpReceiver = transceiver.rtpReceiver ||
              new window.RTCRtpReceiver(transceiver.dtlsTransport, kind);

          if (isNewTrack) {
            var stream;
            track = rtpReceiver.track;
            // FIXME: does not work with Plan B.
            if (remoteMsid && remoteMsid.stream === '-') {
              // no-op. a stream id of '-' means: no associated stream.
            } else if (remoteMsid) {
              if (!streams[remoteMsid.stream]) {
                streams[remoteMsid.stream] = new window.MediaStream();
                Object.defineProperty(streams[remoteMsid.stream], 'id', {
                  get: function() {
                    return remoteMsid.stream;
                  }
                });
              }
              Object.defineProperty(track, 'id', {
                get: function() {
                  return remoteMsid.track;
                }
              });
              stream = streams[remoteMsid.stream];
            } else {
              if (!streams.default) {
                streams.default = new window.MediaStream();
              }
              stream = streams.default;
            }
            if (stream) {
              addTrackToStreamAndFireEvent(track, stream);
              transceiver.associatedRemoteMediaStreams.push(stream);
            }
            receiverList.push([track, rtpReceiver, stream]);
          }
        } else if (transceiver.rtpReceiver && transceiver.rtpReceiver.track) {
          transceiver.associatedRemoteMediaStreams.forEach(function(s) {
            var nativeTrack = s.getTracks().find(function(t) {
              return t.id === transceiver.rtpReceiver.track.id;
            });
            if (nativeTrack) {
              removeTrackFromStreamAndFireEvent(nativeTrack, s);
            }
          });
          transceiver.associatedRemoteMediaStreams = [];
        }

        transceiver.localCapabilities = localCapabilities;
        transceiver.remoteCapabilities = remoteCapabilities;
        transceiver.rtpReceiver = rtpReceiver;
        transceiver.rtcpParameters = rtcpParameters;
        transceiver.sendEncodingParameters = sendEncodingParameters;
        transceiver.recvEncodingParameters = recvEncodingParameters;

        // Start the RTCRtpReceiver now. The RTPSender is started in
        // setLocalDescription.
        pc._transceive(pc.transceivers[sdpMLineIndex],
            false,
            isNewTrack);
      } else if (description.type === 'answer' && !rejected) {
        transceiver = pc.transceivers[sdpMLineIndex];
        iceGatherer = transceiver.iceGatherer;
        iceTransport = transceiver.iceTransport;
        dtlsTransport = transceiver.dtlsTransport;
        rtpReceiver = transceiver.rtpReceiver;
        sendEncodingParameters = transceiver.sendEncodingParameters;
        localCapabilities = transceiver.localCapabilities;

        pc.transceivers[sdpMLineIndex].recvEncodingParameters =
            recvEncodingParameters;
        pc.transceivers[sdpMLineIndex].remoteCapabilities =
            remoteCapabilities;
        pc.transceivers[sdpMLineIndex].rtcpParameters = rtcpParameters;

        if (cands.length && iceTransport.state === 'new') {
          if ((isIceLite || isComplete) &&
              (!usingBundle || sdpMLineIndex === 0)) {
            iceTransport.setRemoteCandidates(cands);
          } else {
            cands.forEach(function(candidate) {
              maybeAddCandidate(transceiver.iceTransport, candidate);
            });
          }
        }

        if (!usingBundle || sdpMLineIndex === 0) {
          if (iceTransport.state === 'new') {
            iceTransport.start(iceGatherer, remoteIceParameters,
                'controlling');
          }
          if (dtlsTransport.state === 'new') {
            dtlsTransport.start(remoteDtlsParameters);
          }
        }

        // If the offer contained RTX but the answer did not,
        // remove RTX from sendEncodingParameters.
        var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

        var hasRtx = commonCapabilities.codecs.filter(function(c) {
          return c.name.toLowerCase() === 'rtx';
        }).length;
        if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
          delete transceiver.sendEncodingParameters[0].rtx;
        }

        pc._transceive(transceiver,
            direction === 'sendrecv' || direction === 'recvonly',
            direction === 'sendrecv' || direction === 'sendonly');

        // TODO: rewrite to use http://w3c.github.io/webrtc-pc/#set-associated-remote-streams
        if (rtpReceiver &&
            (direction === 'sendrecv' || direction === 'sendonly')) {
          track = rtpReceiver.track;
          if (remoteMsid) {
            if (!streams[remoteMsid.stream]) {
              streams[remoteMsid.stream] = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams[remoteMsid.stream]);
            receiverList.push([track, rtpReceiver, streams[remoteMsid.stream]]);
          } else {
            if (!streams.default) {
              streams.default = new window.MediaStream();
            }
            addTrackToStreamAndFireEvent(track, streams.default);
            receiverList.push([track, rtpReceiver, streams.default]);
          }
        } else {
          // FIXME: actually the receiver should be created later.
          delete transceiver.rtpReceiver;
        }
      }
    });

    if (pc._dtlsRole === undefined) {
      pc._dtlsRole = description.type === 'offer' ? 'active' : 'passive';
    }

    pc._remoteDescription = {
      type: description.type,
      sdp: description.sdp
    };
    if (description.type === 'offer') {
      pc._updateSignalingState('have-remote-offer');
    } else {
      pc._updateSignalingState('stable');
    }
    Object.keys(streams).forEach(function(sid) {
      var stream = streams[sid];
      if (stream.getTracks().length) {
        if (pc.remoteStreams.indexOf(stream) === -1) {
          pc.remoteStreams.push(stream);
          var event = new Event('addstream');
          event.stream = stream;
          window.setTimeout(function() {
            pc._dispatchEvent('addstream', event);
          });
        }

        receiverList.forEach(function(item) {
          var track = item[0];
          var receiver = item[1];
          if (stream.id !== item[2].id) {
            return;
          }
          fireAddTrack(pc, track, receiver, [stream]);
        });
      }
    });
    receiverList.forEach(function(item) {
      if (item[2]) {
        return;
      }
      fireAddTrack(pc, item[0], item[1], []);
    });

    // check whether addIceCandidate({}) was called within four seconds after
    // setRemoteDescription.
    window.setTimeout(function() {
      if (!(pc && pc.transceivers)) {
        return;
      }
      pc.transceivers.forEach(function(transceiver) {
        if (transceiver.iceTransport &&
            transceiver.iceTransport.state === 'new' &&
            transceiver.iceTransport.getRemoteCandidates().length > 0) {
          console.warn('Timeout for addRemoteCandidate. Consider sending ' +
              'an end-of-candidates notification');
          transceiver.iceTransport.addRemoteCandidate({});
        }
      });
    }, 4000);

    return Promise.resolve();
  };

  RTCPeerConnection.prototype.close = function() {
    this.transceivers.forEach(function(transceiver) {
      /* not yet
      if (transceiver.iceGatherer) {
        transceiver.iceGatherer.close();
      }
      */
      if (transceiver.iceTransport) {
        transceiver.iceTransport.stop();
      }
      if (transceiver.dtlsTransport) {
        transceiver.dtlsTransport.stop();
      }
      if (transceiver.rtpSender) {
        transceiver.rtpSender.stop();
      }
      if (transceiver.rtpReceiver) {
        transceiver.rtpReceiver.stop();
      }
    });
    // FIXME: clean up tracks, local streams, remote streams, etc
    this._isClosed = true;
    this._updateSignalingState('closed');
  };

  // Update the signaling state.
  RTCPeerConnection.prototype._updateSignalingState = function(newState) {
    this.signalingState = newState;
    var event = new Event('signalingstatechange');
    this._dispatchEvent('signalingstatechange', event);
  };

  // Determine whether to fire the negotiationneeded event.
  RTCPeerConnection.prototype._maybeFireNegotiationNeeded = function() {
    var pc = this;
    if (this.signalingState !== 'stable' || this.needNegotiation === true) {
      return;
    }
    this.needNegotiation = true;
    window.setTimeout(function() {
      if (pc.needNegotiation) {
        pc.needNegotiation = false;
        var event = new Event('negotiationneeded');
        pc._dispatchEvent('negotiationneeded', event);
      }
    }, 0);
  };

  // Update the ice connection state.
  RTCPeerConnection.prototype._updateIceConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      checking: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
      }
    });

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.checking > 0) {
      newState = 'checking';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    } else if (states.completed > 0) {
      newState = 'completed';
    }

    if (newState !== this.iceConnectionState) {
      this.iceConnectionState = newState;
      var event = new Event('iceconnectionstatechange');
      this._dispatchEvent('iceconnectionstatechange', event);
    }
  };

  // Update the connection state.
  RTCPeerConnection.prototype._updateConnectionState = function() {
    var newState;
    var states = {
      'new': 0,
      closed: 0,
      connecting: 0,
      connected: 0,
      completed: 0,
      disconnected: 0,
      failed: 0
    };
    this.transceivers.forEach(function(transceiver) {
      if (transceiver.iceTransport && transceiver.dtlsTransport &&
          !transceiver.rejected) {
        states[transceiver.iceTransport.state]++;
        states[transceiver.dtlsTransport.state]++;
      }
    });
    // ICETransport.completed and connected are the same for this purpose.
    states.connected += states.completed;

    newState = 'new';
    if (states.failed > 0) {
      newState = 'failed';
    } else if (states.connecting > 0) {
      newState = 'connecting';
    } else if (states.disconnected > 0) {
      newState = 'disconnected';
    } else if (states.new > 0) {
      newState = 'new';
    } else if (states.connected > 0) {
      newState = 'connected';
    }

    if (newState !== this.connectionState) {
      this.connectionState = newState;
      var event = new Event('connectionstatechange');
      this._dispatchEvent('connectionstatechange', event);
    }
  };

  RTCPeerConnection.prototype.createOffer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createOffer after close'));
    }

    var numAudioTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'audio';
    }).length;
    var numVideoTracks = pc.transceivers.filter(function(t) {
      return t.kind === 'video';
    }).length;

    // Determine number of audio and video tracks we need to send/recv.
    var offerOptions = arguments[0];
    if (offerOptions) {
      // Reject Chrome legacy constraints.
      if (offerOptions.mandatory || offerOptions.optional) {
        throw new TypeError(
            'Legacy mandatory/optional constraints not supported.');
      }
      if (offerOptions.offerToReceiveAudio !== undefined) {
        if (offerOptions.offerToReceiveAudio === true) {
          numAudioTracks = 1;
        } else if (offerOptions.offerToReceiveAudio === false) {
          numAudioTracks = 0;
        } else {
          numAudioTracks = offerOptions.offerToReceiveAudio;
        }
      }
      if (offerOptions.offerToReceiveVideo !== undefined) {
        if (offerOptions.offerToReceiveVideo === true) {
          numVideoTracks = 1;
        } else if (offerOptions.offerToReceiveVideo === false) {
          numVideoTracks = 0;
        } else {
          numVideoTracks = offerOptions.offerToReceiveVideo;
        }
      }
    }

    pc.transceivers.forEach(function(transceiver) {
      if (transceiver.kind === 'audio') {
        numAudioTracks--;
        if (numAudioTracks < 0) {
          transceiver.wantReceive = false;
        }
      } else if (transceiver.kind === 'video') {
        numVideoTracks--;
        if (numVideoTracks < 0) {
          transceiver.wantReceive = false;
        }
      }
    });

    // Create M-lines for recvonly streams.
    while (numAudioTracks > 0 || numVideoTracks > 0) {
      if (numAudioTracks > 0) {
        pc._createTransceiver('audio');
        numAudioTracks--;
      }
      if (numVideoTracks > 0) {
        pc._createTransceiver('video');
        numVideoTracks--;
      }
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      // For each track, create an ice gatherer, ice transport,
      // dtls transport, potentially rtpsender and rtpreceiver.
      var track = transceiver.track;
      var kind = transceiver.kind;
      var mid = transceiver.mid || SDPUtils.generateIdentifier();
      transceiver.mid = mid;

      if (!transceiver.iceGatherer) {
        transceiver.iceGatherer = pc._createIceGatherer(sdpMLineIndex,
            pc.usingBundle);
      }

      var localCapabilities = window.RTCRtpSender.getCapabilities(kind);
      // filter RTX until additional stuff needed for RTX is implemented
      // in adapter.js
      if (edgeVersion < 15019) {
        localCapabilities.codecs = localCapabilities.codecs.filter(
            function(codec) {
              return codec.name !== 'rtx';
            });
      }
      localCapabilities.codecs.forEach(function(codec) {
        // work around https://bugs.chromium.org/p/webrtc/issues/detail?id=6552
        // by adding level-asymmetry-allowed=1
        if (codec.name === 'H264' &&
            codec.parameters['level-asymmetry-allowed'] === undefined) {
          codec.parameters['level-asymmetry-allowed'] = '1';
        }

        // for subsequent offers, we might have to re-use the payload
        // type of the last offer.
        if (transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.codecs) {
          transceiver.remoteCapabilities.codecs.forEach(function(remoteCodec) {
            if (codec.name.toLowerCase() === remoteCodec.name.toLowerCase() &&
                codec.clockRate === remoteCodec.clockRate) {
              codec.preferredPayloadType = remoteCodec.payloadType;
            }
          });
        }
      });
      localCapabilities.headerExtensions.forEach(function(hdrExt) {
        var remoteExtensions = transceiver.remoteCapabilities &&
            transceiver.remoteCapabilities.headerExtensions || [];
        remoteExtensions.forEach(function(rHdrExt) {
          if (hdrExt.uri === rHdrExt.uri) {
            hdrExt.id = rHdrExt.id;
          }
        });
      });

      // generate an ssrc now, to be used later in rtpSender.send
      var sendEncodingParameters = transceiver.sendEncodingParameters || [{
        ssrc: (2 * sdpMLineIndex + 1) * 1001
      }];
      if (track) {
        // add RTX
        if (edgeVersion >= 15019 && kind === 'video' &&
            !sendEncodingParameters[0].rtx) {
          sendEncodingParameters[0].rtx = {
            ssrc: sendEncodingParameters[0].ssrc + 1
          };
        }
      }

      if (transceiver.wantReceive) {
        transceiver.rtpReceiver = new window.RTCRtpReceiver(
            transceiver.dtlsTransport, kind);
      }

      transceiver.localCapabilities = localCapabilities;
      transceiver.sendEncodingParameters = sendEncodingParameters;
    });

    // always offer BUNDLE and dispose on return if not supported.
    if (pc._config.bundlePolicy !== 'max-compat') {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      sdp += writeMediaSection(transceiver, transceiver.localCapabilities,
          'offer', transceiver.stream, pc._dtlsRole);
      sdp += 'a=rtcp-rsize\r\n';

      if (transceiver.iceGatherer && pc.iceGatheringState !== 'new' &&
          (sdpMLineIndex === 0 || !pc.usingBundle)) {
        transceiver.iceGatherer.getLocalCandidates().forEach(function(cand) {
          cand.component = 1;
          sdp += 'a=' + SDPUtils.writeCandidate(cand) + '\r\n';
        });

        if (transceiver.iceGatherer.state === 'completed') {
          sdp += 'a=end-of-candidates\r\n';
        }
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'offer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.createAnswer = function() {
    var pc = this;

    if (pc._isClosed) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer after close'));
    }

    if (!(pc.signalingState === 'have-remote-offer' ||
        pc.signalingState === 'have-local-pranswer')) {
      return Promise.reject(makeError('InvalidStateError',
          'Can not call createAnswer in signalingState ' + pc.signalingState));
    }

    var sdp = SDPUtils.writeSessionBoilerplate(pc._sdpSessionId,
        pc._sdpSessionVersion++);
    if (pc.usingBundle) {
      sdp += 'a=group:BUNDLE ' + pc.transceivers.map(function(t) {
        return t.mid;
      }).join(' ') + '\r\n';
    }
    sdp += 'a=ice-options:trickle\r\n';

    var mediaSectionsInOffer = SDPUtils.getMediaSections(
        pc._remoteDescription.sdp).length;
    pc.transceivers.forEach(function(transceiver, sdpMLineIndex) {
      if (sdpMLineIndex + 1 > mediaSectionsInOffer) {
        return;
      }
      if (transceiver.rejected) {
        if (transceiver.kind === 'application') {
          if (transceiver.protocol === 'DTLS/SCTP') { // legacy fmt
            sdp += 'm=application 0 DTLS/SCTP 5000\r\n';
          } else {
            sdp += 'm=application 0 ' + transceiver.protocol +
                ' webrtc-datachannel\r\n';
          }
        } else if (transceiver.kind === 'audio') {
          sdp += 'm=audio 0 UDP/TLS/RTP/SAVPF 0\r\n' +
              'a=rtpmap:0 PCMU/8000\r\n';
        } else if (transceiver.kind === 'video') {
          sdp += 'm=video 0 UDP/TLS/RTP/SAVPF 120\r\n' +
              'a=rtpmap:120 VP8/90000\r\n';
        }
        sdp += 'c=IN IP4 0.0.0.0\r\n' +
            'a=inactive\r\n' +
            'a=mid:' + transceiver.mid + '\r\n';
        return;
      }

      // FIXME: look at direction.
      if (transceiver.stream) {
        var localTrack;
        if (transceiver.kind === 'audio') {
          localTrack = transceiver.stream.getAudioTracks()[0];
        } else if (transceiver.kind === 'video') {
          localTrack = transceiver.stream.getVideoTracks()[0];
        }
        if (localTrack) {
          // add RTX
          if (edgeVersion >= 15019 && transceiver.kind === 'video' &&
              !transceiver.sendEncodingParameters[0].rtx) {
            transceiver.sendEncodingParameters[0].rtx = {
              ssrc: transceiver.sendEncodingParameters[0].ssrc + 1
            };
          }
        }
      }

      // Calculate intersection of capabilities.
      var commonCapabilities = getCommonCapabilities(
          transceiver.localCapabilities,
          transceiver.remoteCapabilities);

      var hasRtx = commonCapabilities.codecs.filter(function(c) {
        return c.name.toLowerCase() === 'rtx';
      }).length;
      if (!hasRtx && transceiver.sendEncodingParameters[0].rtx) {
        delete transceiver.sendEncodingParameters[0].rtx;
      }

      sdp += writeMediaSection(transceiver, commonCapabilities,
          'answer', transceiver.stream, pc._dtlsRole);
      if (transceiver.rtcpParameters &&
          transceiver.rtcpParameters.reducedSize) {
        sdp += 'a=rtcp-rsize\r\n';
      }
    });

    var desc = new window.RTCSessionDescription({
      type: 'answer',
      sdp: sdp
    });
    return Promise.resolve(desc);
  };

  RTCPeerConnection.prototype.addIceCandidate = function(candidate) {
    var pc = this;
    var sections;
    if (candidate && !(candidate.sdpMLineIndex !== undefined ||
        candidate.sdpMid)) {
      return Promise.reject(new TypeError('sdpMLineIndex or sdpMid required'));
    }

    // TODO: needs to go into ops queue.
    return new Promise(function(resolve, reject) {
      if (!pc._remoteDescription) {
        return reject(makeError('InvalidStateError',
            'Can not add ICE candidate without a remote description'));
      } else if (!candidate || candidate.candidate === '') {
        for (var j = 0; j < pc.transceivers.length; j++) {
          if (pc.transceivers[j].rejected) {
            continue;
          }
          pc.transceivers[j].iceTransport.addRemoteCandidate({});
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[j] += 'a=end-of-candidates\r\n';
          pc._remoteDescription.sdp =
              SDPUtils.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
          if (pc.usingBundle) {
            break;
          }
        }
      } else {
        var sdpMLineIndex = candidate.sdpMLineIndex;
        if (candidate.sdpMid) {
          for (var i = 0; i < pc.transceivers.length; i++) {
            if (pc.transceivers[i].mid === candidate.sdpMid) {
              sdpMLineIndex = i;
              break;
            }
          }
        }
        var transceiver = pc.transceivers[sdpMLineIndex];
        if (transceiver) {
          if (transceiver.rejected) {
            return resolve();
          }
          var cand = Object.keys(candidate.candidate).length > 0 ?
              SDPUtils.parseCandidate(candidate.candidate) : {};
          // Ignore Chrome's invalid candidates since Edge does not like them.
          if (cand.protocol === 'tcp' && (cand.port === 0 || cand.port === 9)) {
            return resolve();
          }
          // Ignore RTCP candidates, we assume RTCP-MUX.
          if (cand.component && cand.component !== 1) {
            return resolve();
          }
          // when using bundle, avoid adding candidates to the wrong
          // ice transport. And avoid adding candidates added in the SDP.
          if (sdpMLineIndex === 0 || (sdpMLineIndex > 0 &&
              transceiver.iceTransport !== pc.transceivers[0].iceTransport)) {
            if (!maybeAddCandidate(transceiver.iceTransport, cand)) {
              return reject(makeError('OperationError',
                  'Can not add ICE candidate'));
            }
          }

          // update the remoteDescription.
          var candidateString = candidate.candidate.trim();
          if (candidateString.indexOf('a=') === 0) {
            candidateString = candidateString.substr(2);
          }
          sections = SDPUtils.getMediaSections(pc._remoteDescription.sdp);
          sections[sdpMLineIndex] += 'a=' +
              (cand.type ? candidateString : 'end-of-candidates')
              + '\r\n';
          pc._remoteDescription.sdp =
              SDPUtils.getDescription(pc._remoteDescription.sdp) +
              sections.join('');
        } else {
          return reject(makeError('OperationError',
              'Can not add ICE candidate'));
        }
      }
      resolve();
    });
  };

  RTCPeerConnection.prototype.getStats = function(selector) {
    if (selector && selector instanceof window.MediaStreamTrack) {
      var senderOrReceiver = null;
      this.transceivers.forEach(function(transceiver) {
        if (transceiver.rtpSender &&
            transceiver.rtpSender.track === selector) {
          senderOrReceiver = transceiver.rtpSender;
        } else if (transceiver.rtpReceiver &&
            transceiver.rtpReceiver.track === selector) {
          senderOrReceiver = transceiver.rtpReceiver;
        }
      });
      if (!senderOrReceiver) {
        throw makeError('InvalidAccessError', 'Invalid selector.');
      }
      return senderOrReceiver.getStats();
    }

    var promises = [];
    this.transceivers.forEach(function(transceiver) {
      ['rtpSender', 'rtpReceiver', 'iceGatherer', 'iceTransport',
          'dtlsTransport'].forEach(function(method) {
            if (transceiver[method]) {
              promises.push(transceiver[method].getStats());
            }
          });
    });
    return Promise.all(promises).then(function(allStats) {
      var results = new Map();
      allStats.forEach(function(stats) {
        stats.forEach(function(stat) {
          results.set(stat.id, stat);
        });
      });
      return results;
    });
  };

  // fix low-level stat names and return Map instead of object.
  var ortcObjects = ['RTCRtpSender', 'RTCRtpReceiver', 'RTCIceGatherer',
    'RTCIceTransport', 'RTCDtlsTransport'];
  ortcObjects.forEach(function(ortcObjectName) {
    var obj = window[ortcObjectName];
    if (obj && obj.prototype && obj.prototype.getStats) {
      var nativeGetstats = obj.prototype.getStats;
      obj.prototype.getStats = function() {
        return nativeGetstats.apply(this)
        .then(function(nativeStats) {
          var mapStats = new Map();
          Object.keys(nativeStats).forEach(function(id) {
            nativeStats[id].type = fixStatsType(nativeStats[id]);
            mapStats.set(id, nativeStats[id]);
          });
          return mapStats;
        });
      };
    }
  });

  // legacy callback shims. Should be moved to adapter.js some days.
  var methods = ['createOffer', 'createAnswer'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[0] === 'function' ||
          typeof args[1] === 'function') { // legacy
        return nativeMethod.apply(this, [arguments[2]])
        .then(function(description) {
          if (typeof args[0] === 'function') {
            args[0].apply(null, [description]);
          }
        }, function(error) {
          if (typeof args[1] === 'function') {
            args[1].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  methods = ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate'];
  methods.forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function' ||
          typeof args[2] === 'function') { // legacy
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        }, function(error) {
          if (typeof args[2] === 'function') {
            args[2].apply(null, [error]);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  // getStats is special. It doesn't have a spec legacy method yet we support
  // getStats(something, cb) without error callbacks.
  ['getStats'].forEach(function(method) {
    var nativeMethod = RTCPeerConnection.prototype[method];
    RTCPeerConnection.prototype[method] = function() {
      var args = arguments;
      if (typeof args[1] === 'function') {
        return nativeMethod.apply(this, arguments)
        .then(function() {
          if (typeof args[1] === 'function') {
            args[1].apply(null);
          }
        });
      }
      return nativeMethod.apply(this, arguments);
    };
  });

  return RTCPeerConnection;
};


/***/ }),

/***/ "./node_modules/sdp/sdp.js":
/*!*********************************!*\
  !*** ./node_modules/sdp/sdp.js ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
 /* eslint-env node */


// SDP helpers.
var SDPUtils = {};

// Generate an alphanumeric identifier for cname or mids.
// TODO: use UUIDs instead? https://gist.github.com/jed/982883
SDPUtils.generateIdentifier = function() {
  return Math.random().toString(36).substr(2, 10);
};

// The RTCP CNAME used by all peerconnections from the same JS.
SDPUtils.localCName = SDPUtils.generateIdentifier();

// Splits SDP into lines, dealing with both CRLF and LF.
SDPUtils.splitLines = function(blob) {
  return blob.trim().split('\n').map(function(line) {
    return line.trim();
  });
};
// Splits SDP into sessionpart and mediasections. Ensures CRLF.
SDPUtils.splitSections = function(blob) {
  var parts = blob.split('\nm=');
  return parts.map(function(part, index) {
    return (index > 0 ? 'm=' + part : part).trim() + '\r\n';
  });
};

// returns the session description.
SDPUtils.getDescription = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  return sections && sections[0];
};

// returns the individual media sections.
SDPUtils.getMediaSections = function(blob) {
  var sections = SDPUtils.splitSections(blob);
  sections.shift();
  return sections;
};

// Returns lines that start with a certain prefix.
SDPUtils.matchPrefix = function(blob, prefix) {
  return SDPUtils.splitLines(blob).filter(function(line) {
    return line.indexOf(prefix) === 0;
  });
};

// Parses an ICE candidate line. Sample input:
// candidate:702786350 2 udp 41819902 8.8.8.8 60769 typ relay raddr 8.8.8.8
// rport 55996"
SDPUtils.parseCandidate = function(line) {
  var parts;
  // Parse both variants.
  if (line.indexOf('a=candidate:') === 0) {
    parts = line.substring(12).split(' ');
  } else {
    parts = line.substring(10).split(' ');
  }

  var candidate = {
    foundation: parts[0],
    component: parseInt(parts[1], 10),
    protocol: parts[2].toLowerCase(),
    priority: parseInt(parts[3], 10),
    ip: parts[4],
    address: parts[4], // address is an alias for ip.
    port: parseInt(parts[5], 10),
    // skip parts[6] == 'typ'
    type: parts[7]
  };

  for (var i = 8; i < parts.length; i += 2) {
    switch (parts[i]) {
      case 'raddr':
        candidate.relatedAddress = parts[i + 1];
        break;
      case 'rport':
        candidate.relatedPort = parseInt(parts[i + 1], 10);
        break;
      case 'tcptype':
        candidate.tcpType = parts[i + 1];
        break;
      case 'ufrag':
        candidate.ufrag = parts[i + 1]; // for backward compability.
        candidate.usernameFragment = parts[i + 1];
        break;
      default: // extension handling, in particular ufrag
        candidate[parts[i]] = parts[i + 1];
        break;
    }
  }
  return candidate;
};

// Translates a candidate object into SDP candidate attribute.
SDPUtils.writeCandidate = function(candidate) {
  var sdp = [];
  sdp.push(candidate.foundation);
  sdp.push(candidate.component);
  sdp.push(candidate.protocol.toUpperCase());
  sdp.push(candidate.priority);
  sdp.push(candidate.address || candidate.ip);
  sdp.push(candidate.port);

  var type = candidate.type;
  sdp.push('typ');
  sdp.push(type);
  if (type !== 'host' && candidate.relatedAddress &&
      candidate.relatedPort) {
    sdp.push('raddr');
    sdp.push(candidate.relatedAddress);
    sdp.push('rport');
    sdp.push(candidate.relatedPort);
  }
  if (candidate.tcpType && candidate.protocol.toLowerCase() === 'tcp') {
    sdp.push('tcptype');
    sdp.push(candidate.tcpType);
  }
  if (candidate.usernameFragment || candidate.ufrag) {
    sdp.push('ufrag');
    sdp.push(candidate.usernameFragment || candidate.ufrag);
  }
  return 'candidate:' + sdp.join(' ');
};

// Parses an ice-options line, returns an array of option tags.
// a=ice-options:foo bar
SDPUtils.parseIceOptions = function(line) {
  return line.substr(14).split(' ');
};

// Parses an rtpmap line, returns RTCRtpCoddecParameters. Sample input:
// a=rtpmap:111 opus/48000/2
SDPUtils.parseRtpMap = function(line) {
  var parts = line.substr(9).split(' ');
  var parsed = {
    payloadType: parseInt(parts.shift(), 10) // was: id
  };

  parts = parts[0].split('/');

  parsed.name = parts[0];
  parsed.clockRate = parseInt(parts[1], 10); // was: clockrate
  parsed.channels = parts.length === 3 ? parseInt(parts[2], 10) : 1;
  // legacy alias, got renamed back to channels in ORTC.
  parsed.numChannels = parsed.channels;
  return parsed;
};

// Generate an a=rtpmap line from RTCRtpCodecCapability or
// RTCRtpCodecParameters.
SDPUtils.writeRtpMap = function(codec) {
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  var channels = codec.channels || codec.numChannels || 1;
  return 'a=rtpmap:' + pt + ' ' + codec.name + '/' + codec.clockRate +
      (channels !== 1 ? '/' + channels : '') + '\r\n';
};

// Parses an a=extmap line (headerextension from RFC 5285). Sample input:
// a=extmap:2 urn:ietf:params:rtp-hdrext:toffset
// a=extmap:2/sendonly urn:ietf:params:rtp-hdrext:toffset
SDPUtils.parseExtmap = function(line) {
  var parts = line.substr(9).split(' ');
  return {
    id: parseInt(parts[0], 10),
    direction: parts[0].indexOf('/') > 0 ? parts[0].split('/')[1] : 'sendrecv',
    uri: parts[1]
  };
};

// Generates a=extmap line from RTCRtpHeaderExtensionParameters or
// RTCRtpHeaderExtension.
SDPUtils.writeExtmap = function(headerExtension) {
  return 'a=extmap:' + (headerExtension.id || headerExtension.preferredId) +
      (headerExtension.direction && headerExtension.direction !== 'sendrecv'
          ? '/' + headerExtension.direction
          : '') +
      ' ' + headerExtension.uri + '\r\n';
};

// Parses an ftmp line, returns dictionary. Sample input:
// a=fmtp:96 vbr=on;cng=on
// Also deals with vbr=on; cng=on
SDPUtils.parseFmtp = function(line) {
  var parsed = {};
  var kv;
  var parts = line.substr(line.indexOf(' ') + 1).split(';');
  for (var j = 0; j < parts.length; j++) {
    kv = parts[j].trim().split('=');
    parsed[kv[0].trim()] = kv[1];
  }
  return parsed;
};

// Generates an a=ftmp line from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeFmtp = function(codec) {
  var line = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.parameters && Object.keys(codec.parameters).length) {
    var params = [];
    Object.keys(codec.parameters).forEach(function(param) {
      if (codec.parameters[param]) {
        params.push(param + '=' + codec.parameters[param]);
      } else {
        params.push(param);
      }
    });
    line += 'a=fmtp:' + pt + ' ' + params.join(';') + '\r\n';
  }
  return line;
};

// Parses an rtcp-fb line, returns RTCPRtcpFeedback object. Sample input:
// a=rtcp-fb:98 nack rpsi
SDPUtils.parseRtcpFb = function(line) {
  var parts = line.substr(line.indexOf(' ') + 1).split(' ');
  return {
    type: parts.shift(),
    parameter: parts.join(' ')
  };
};
// Generate a=rtcp-fb lines from RTCRtpCodecCapability or RTCRtpCodecParameters.
SDPUtils.writeRtcpFb = function(codec) {
  var lines = '';
  var pt = codec.payloadType;
  if (codec.preferredPayloadType !== undefined) {
    pt = codec.preferredPayloadType;
  }
  if (codec.rtcpFeedback && codec.rtcpFeedback.length) {
    // FIXME: special handling for trr-int?
    codec.rtcpFeedback.forEach(function(fb) {
      lines += 'a=rtcp-fb:' + pt + ' ' + fb.type +
      (fb.parameter && fb.parameter.length ? ' ' + fb.parameter : '') +
          '\r\n';
    });
  }
  return lines;
};

// Parses an RFC 5576 ssrc media attribute. Sample input:
// a=ssrc:3735928559 cname:something
SDPUtils.parseSsrcMedia = function(line) {
  var sp = line.indexOf(' ');
  var parts = {
    ssrc: parseInt(line.substr(7, sp - 7), 10)
  };
  var colon = line.indexOf(':', sp);
  if (colon > -1) {
    parts.attribute = line.substr(sp + 1, colon - sp - 1);
    parts.value = line.substr(colon + 1);
  } else {
    parts.attribute = line.substr(sp + 1);
  }
  return parts;
};

SDPUtils.parseSsrcGroup = function(line) {
  var parts = line.substr(13).split(' ');
  return {
    semantics: parts.shift(),
    ssrcs: parts.map(function(ssrc) {
      return parseInt(ssrc, 10);
    })
  };
};

// Extracts the MID (RFC 5888) from a media section.
// returns the MID or undefined if no mid line was found.
SDPUtils.getMid = function(mediaSection) {
  var mid = SDPUtils.matchPrefix(mediaSection, 'a=mid:')[0];
  if (mid) {
    return mid.substr(6);
  }
};

SDPUtils.parseFingerprint = function(line) {
  var parts = line.substr(14).split(' ');
  return {
    algorithm: parts[0].toLowerCase(), // algorithm is case-sensitive in Edge.
    value: parts[1]
  };
};

// Extracts DTLS parameters from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the fingerprint line as input. See also getIceParameters.
SDPUtils.getDtlsParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.matchPrefix(mediaSection + sessionpart,
      'a=fingerprint:');
  // Note: a=setup line is ignored since we use the 'auto' role.
  // Note2: 'algorithm' is not case sensitive except in Edge.
  return {
    role: 'auto',
    fingerprints: lines.map(SDPUtils.parseFingerprint)
  };
};

// Serializes DTLS parameters to SDP.
SDPUtils.writeDtlsParameters = function(params, setupType) {
  var sdp = 'a=setup:' + setupType + '\r\n';
  params.fingerprints.forEach(function(fp) {
    sdp += 'a=fingerprint:' + fp.algorithm + ' ' + fp.value + '\r\n';
  });
  return sdp;
};
// Parses ICE information from SDP media section or sessionpart.
// FIXME: for consistency with other functions this should only
//   get the ice-ufrag and ice-pwd lines as input.
SDPUtils.getIceParameters = function(mediaSection, sessionpart) {
  var lines = SDPUtils.splitLines(mediaSection);
  // Search in session part, too.
  lines = lines.concat(SDPUtils.splitLines(sessionpart));
  var iceParameters = {
    usernameFragment: lines.filter(function(line) {
      return line.indexOf('a=ice-ufrag:') === 0;
    })[0].substr(12),
    password: lines.filter(function(line) {
      return line.indexOf('a=ice-pwd:') === 0;
    })[0].substr(10)
  };
  return iceParameters;
};

// Serializes ICE parameters to SDP.
SDPUtils.writeIceParameters = function(params) {
  return 'a=ice-ufrag:' + params.usernameFragment + '\r\n' +
      'a=ice-pwd:' + params.password + '\r\n';
};

// Parses the SDP media section and returns RTCRtpParameters.
SDPUtils.parseRtpParameters = function(mediaSection) {
  var description = {
    codecs: [],
    headerExtensions: [],
    fecMechanisms: [],
    rtcp: []
  };
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  for (var i = 3; i < mline.length; i++) { // find all codecs from mline[3..]
    var pt = mline[i];
    var rtpmapline = SDPUtils.matchPrefix(
        mediaSection, 'a=rtpmap:' + pt + ' ')[0];
    if (rtpmapline) {
      var codec = SDPUtils.parseRtpMap(rtpmapline);
      var fmtps = SDPUtils.matchPrefix(
          mediaSection, 'a=fmtp:' + pt + ' ');
      // Only the first a=fmtp:<pt> is considered.
      codec.parameters = fmtps.length ? SDPUtils.parseFmtp(fmtps[0]) : {};
      codec.rtcpFeedback = SDPUtils.matchPrefix(
          mediaSection, 'a=rtcp-fb:' + pt + ' ')
        .map(SDPUtils.parseRtcpFb);
      description.codecs.push(codec);
      // parse FEC mechanisms from rtpmap lines.
      switch (codec.name.toUpperCase()) {
        case 'RED':
        case 'ULPFEC':
          description.fecMechanisms.push(codec.name.toUpperCase());
          break;
        default: // only RED and ULPFEC are recognized as FEC mechanisms.
          break;
      }
    }
  }
  SDPUtils.matchPrefix(mediaSection, 'a=extmap:').forEach(function(line) {
    description.headerExtensions.push(SDPUtils.parseExtmap(line));
  });
  // FIXME: parse rtcp.
  return description;
};

// Generates parts of the SDP media section describing the capabilities /
// parameters.
SDPUtils.writeRtpDescription = function(kind, caps) {
  var sdp = '';

  // Build the mline.
  sdp += 'm=' + kind + ' ';
  sdp += caps.codecs.length > 0 ? '9' : '0'; // reject if no codecs.
  sdp += ' UDP/TLS/RTP/SAVPF ';
  sdp += caps.codecs.map(function(codec) {
    if (codec.preferredPayloadType !== undefined) {
      return codec.preferredPayloadType;
    }
    return codec.payloadType;
  }).join(' ') + '\r\n';

  sdp += 'c=IN IP4 0.0.0.0\r\n';
  sdp += 'a=rtcp:9 IN IP4 0.0.0.0\r\n';

  // Add a=rtpmap lines for each codec. Also fmtp and rtcp-fb.
  caps.codecs.forEach(function(codec) {
    sdp += SDPUtils.writeRtpMap(codec);
    sdp += SDPUtils.writeFmtp(codec);
    sdp += SDPUtils.writeRtcpFb(codec);
  });
  var maxptime = 0;
  caps.codecs.forEach(function(codec) {
    if (codec.maxptime > maxptime) {
      maxptime = codec.maxptime;
    }
  });
  if (maxptime > 0) {
    sdp += 'a=maxptime:' + maxptime + '\r\n';
  }
  sdp += 'a=rtcp-mux\r\n';

  if (caps.headerExtensions) {
    caps.headerExtensions.forEach(function(extension) {
      sdp += SDPUtils.writeExtmap(extension);
    });
  }
  // FIXME: write fecMechanisms.
  return sdp;
};

// Parses the SDP media section and returns an array of
// RTCRtpEncodingParameters.
SDPUtils.parseRtpEncodingParameters = function(mediaSection) {
  var encodingParameters = [];
  var description = SDPUtils.parseRtpParameters(mediaSection);
  var hasRed = description.fecMechanisms.indexOf('RED') !== -1;
  var hasUlpfec = description.fecMechanisms.indexOf('ULPFEC') !== -1;

  // filter a=ssrc:... cname:, ignore PlanB-msid
  var ssrcs = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(parts) {
    return parts.attribute === 'cname';
  });
  var primarySsrc = ssrcs.length > 0 && ssrcs[0].ssrc;
  var secondarySsrc;

  var flows = SDPUtils.matchPrefix(mediaSection, 'a=ssrc-group:FID')
  .map(function(line) {
    var parts = line.substr(17).split(' ');
    return parts.map(function(part) {
      return parseInt(part, 10);
    });
  });
  if (flows.length > 0 && flows[0].length > 1 && flows[0][0] === primarySsrc) {
    secondarySsrc = flows[0][1];
  }

  description.codecs.forEach(function(codec) {
    if (codec.name.toUpperCase() === 'RTX' && codec.parameters.apt) {
      var encParam = {
        ssrc: primarySsrc,
        codecPayloadType: parseInt(codec.parameters.apt, 10)
      };
      if (primarySsrc && secondarySsrc) {
        encParam.rtx = {ssrc: secondarySsrc};
      }
      encodingParameters.push(encParam);
      if (hasRed) {
        encParam = JSON.parse(JSON.stringify(encParam));
        encParam.fec = {
          ssrc: primarySsrc,
          mechanism: hasUlpfec ? 'red+ulpfec' : 'red'
        };
        encodingParameters.push(encParam);
      }
    }
  });
  if (encodingParameters.length === 0 && primarySsrc) {
    encodingParameters.push({
      ssrc: primarySsrc
    });
  }

  // we support both b=AS and b=TIAS but interpret AS as TIAS.
  var bandwidth = SDPUtils.matchPrefix(mediaSection, 'b=');
  if (bandwidth.length) {
    if (bandwidth[0].indexOf('b=TIAS:') === 0) {
      bandwidth = parseInt(bandwidth[0].substr(7), 10);
    } else if (bandwidth[0].indexOf('b=AS:') === 0) {
      // use formula from JSEP to convert b=AS to TIAS value.
      bandwidth = parseInt(bandwidth[0].substr(5), 10) * 1000 * 0.95
          - (50 * 40 * 8);
    } else {
      bandwidth = undefined;
    }
    encodingParameters.forEach(function(params) {
      params.maxBitrate = bandwidth;
    });
  }
  return encodingParameters;
};

// parses http://draft.ortc.org/#rtcrtcpparameters*
SDPUtils.parseRtcpParameters = function(mediaSection) {
  var rtcpParameters = {};

  // Gets the first SSRC. Note tha with RTX there might be multiple
  // SSRCs.
  var remoteSsrc = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
      .map(function(line) {
        return SDPUtils.parseSsrcMedia(line);
      })
      .filter(function(obj) {
        return obj.attribute === 'cname';
      })[0];
  if (remoteSsrc) {
    rtcpParameters.cname = remoteSsrc.value;
    rtcpParameters.ssrc = remoteSsrc.ssrc;
  }

  // Edge uses the compound attribute instead of reducedSize
  // compound is !reducedSize
  var rsize = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-rsize');
  rtcpParameters.reducedSize = rsize.length > 0;
  rtcpParameters.compound = rsize.length === 0;

  // parses the rtcp-mux attrіbute.
  // Note that Edge does not support unmuxed RTCP.
  var mux = SDPUtils.matchPrefix(mediaSection, 'a=rtcp-mux');
  rtcpParameters.mux = mux.length > 0;

  return rtcpParameters;
};

// parses either a=msid: or a=ssrc:... msid lines and returns
// the id of the MediaStream and MediaStreamTrack.
SDPUtils.parseMsid = function(mediaSection) {
  var parts;
  var spec = SDPUtils.matchPrefix(mediaSection, 'a=msid:');
  if (spec.length === 1) {
    parts = spec[0].substr(7).split(' ');
    return {stream: parts[0], track: parts[1]};
  }
  var planB = SDPUtils.matchPrefix(mediaSection, 'a=ssrc:')
  .map(function(line) {
    return SDPUtils.parseSsrcMedia(line);
  })
  .filter(function(msidParts) {
    return msidParts.attribute === 'msid';
  });
  if (planB.length > 0) {
    parts = planB[0].value.split(' ');
    return {stream: parts[0], track: parts[1]};
  }
};

// Generate a session ID for SDP.
// https://tools.ietf.org/html/draft-ietf-rtcweb-jsep-20#section-5.2.1
// recommends using a cryptographically random +ve 64-bit value
// but right now this should be acceptable and within the right range
SDPUtils.generateSessionId = function() {
  return Math.random().toString().substr(2, 21);
};

// Write boilder plate for start of SDP
// sessId argument is optional - if not supplied it will
// be generated randomly
// sessVersion is optional and defaults to 2
// sessUser is optional and defaults to 'thisisadapterortc'
SDPUtils.writeSessionBoilerplate = function(sessId, sessVer, sessUser) {
  var sessionId;
  var version = sessVer !== undefined ? sessVer : 2;
  if (sessId) {
    sessionId = sessId;
  } else {
    sessionId = SDPUtils.generateSessionId();
  }
  var user = sessUser || 'thisisadapterortc';
  // FIXME: sess-id should be an NTP timestamp.
  return 'v=0\r\n' +
      'o=' + user + ' ' + sessionId + ' ' + version +
        ' IN IP4 127.0.0.1\r\n' +
      's=-\r\n' +
      't=0 0\r\n';
};

SDPUtils.writeMediaSection = function(transceiver, caps, type, stream) {
  var sdp = SDPUtils.writeRtpDescription(transceiver.kind, caps);

  // Map ICE parameters (ufrag, pwd) to SDP.
  sdp += SDPUtils.writeIceParameters(
      transceiver.iceGatherer.getLocalParameters());

  // Map DTLS parameters to SDP.
  sdp += SDPUtils.writeDtlsParameters(
      transceiver.dtlsTransport.getLocalParameters(),
      type === 'offer' ? 'actpass' : 'active');

  sdp += 'a=mid:' + transceiver.mid + '\r\n';

  if (transceiver.direction) {
    sdp += 'a=' + transceiver.direction + '\r\n';
  } else if (transceiver.rtpSender && transceiver.rtpReceiver) {
    sdp += 'a=sendrecv\r\n';
  } else if (transceiver.rtpSender) {
    sdp += 'a=sendonly\r\n';
  } else if (transceiver.rtpReceiver) {
    sdp += 'a=recvonly\r\n';
  } else {
    sdp += 'a=inactive\r\n';
  }

  if (transceiver.rtpSender) {
    // spec.
    var msid = 'msid:' + stream.id + ' ' +
        transceiver.rtpSender.track.id + '\r\n';
    sdp += 'a=' + msid;

    // for Chrome.
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
        ' ' + msid;
    if (transceiver.sendEncodingParameters[0].rtx) {
      sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
          ' ' + msid;
      sdp += 'a=ssrc-group:FID ' +
          transceiver.sendEncodingParameters[0].ssrc + ' ' +
          transceiver.sendEncodingParameters[0].rtx.ssrc +
          '\r\n';
    }
  }
  // FIXME: this should be written by writeRtpDescription.
  sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].ssrc +
      ' cname:' + SDPUtils.localCName + '\r\n';
  if (transceiver.rtpSender && transceiver.sendEncodingParameters[0].rtx) {
    sdp += 'a=ssrc:' + transceiver.sendEncodingParameters[0].rtx.ssrc +
        ' cname:' + SDPUtils.localCName + '\r\n';
  }
  return sdp;
};

// Gets the direction from the mediaSection or the sessionpart.
SDPUtils.getDirection = function(mediaSection, sessionpart) {
  // Look for sendrecv, sendonly, recvonly, inactive, default to sendrecv.
  var lines = SDPUtils.splitLines(mediaSection);
  for (var i = 0; i < lines.length; i++) {
    switch (lines[i]) {
      case 'a=sendrecv':
      case 'a=sendonly':
      case 'a=recvonly':
      case 'a=inactive':
        return lines[i].substr(2);
      default:
        // FIXME: What should happen here?
    }
  }
  if (sessionpart) {
    return SDPUtils.getDirection(sessionpart);
  }
  return 'sendrecv';
};

SDPUtils.getKind = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var mline = lines[0].split(' ');
  return mline[0].substr(2);
};

SDPUtils.isRejected = function(mediaSection) {
  return mediaSection.split(' ', 2)[1] === '0';
};

SDPUtils.parseMLine = function(mediaSection) {
  var lines = SDPUtils.splitLines(mediaSection);
  var parts = lines[0].substr(2).split(' ');
  return {
    kind: parts[0],
    port: parseInt(parts[1], 10),
    protocol: parts[2],
    fmt: parts.slice(3).join(' ')
  };
};

SDPUtils.parseOLine = function(mediaSection) {
  var line = SDPUtils.matchPrefix(mediaSection, 'o=')[0];
  var parts = line.substr(2).split(' ');
  return {
    username: parts[0],
    sessionId: parts[1],
    sessionVersion: parseInt(parts[2], 10),
    netType: parts[3],
    addressType: parts[4],
    address: parts[5]
  };
};

// a very naive interpretation of a valid SDP.
SDPUtils.isValidSDP = function(blob) {
  if (typeof blob !== 'string' || blob.length === 0) {
    return false;
  }
  var lines = SDPUtils.splitLines(blob);
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].length < 2 || lines[i].charAt(1) !== '=') {
      return false;
    }
    // TODO: check the modifier a bit more.
  }
  return true;
};

// Expose public methods.
if (true) {
  module.exports = SDPUtils;
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/adapter_core.js":
/*!************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/adapter_core.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



var adapterFactory = __webpack_require__(/*! ./adapter_factory.js */ "./node_modules/webrtc-adapter/src/js/adapter_factory.js");
module.exports = adapterFactory({window: global.window});

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/adapter_factory.js":
/*!***************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/adapter_factory.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */



var utils = __webpack_require__(/*! ./utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
// Shimming starts here.
module.exports = function(dependencies, opts) {
  var window = dependencies && dependencies.window;

  var options = {
    shimChrome: true,
    shimFirefox: true,
    shimEdge: true,
    shimSafari: true,
  };

  for (var key in opts) {
    if (hasOwnProperty.call(opts, key)) {
      options[key] = opts[key];
    }
  }

  // Utils.
  var logging = utils.log;
  var browserDetails = utils.detectBrowser(window);

  // Uncomment the line below if you want logging to occur, including logging
  // for the switch statement below. Can also be turned on in the browser via
  // adapter.disableLog(false), but then logging from the switch statement below
  // will not appear.
  // require('./utils').disableLog(false);

  // Browser shims.
  var chromeShim = __webpack_require__(/*! ./chrome/chrome_shim */ "./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js") || null;
  var edgeShim = __webpack_require__(/*! ./edge/edge_shim */ "./node_modules/webrtc-adapter/src/js/edge/edge_shim.js") || null;
  var firefoxShim = __webpack_require__(/*! ./firefox/firefox_shim */ "./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js") || null;
  var safariShim = __webpack_require__(/*! ./safari/safari_shim */ "./node_modules/webrtc-adapter/src/js/safari/safari_shim.js") || null;
  var commonShim = __webpack_require__(/*! ./common_shim */ "./node_modules/webrtc-adapter/src/js/common_shim.js") || null;

  // Export to the adapter global object visible in the browser.
  var adapter = {
    browserDetails: browserDetails,
    commonShim: commonShim,
    extractVersion: utils.extractVersion,
    disableLog: utils.disableLog,
    disableWarnings: utils.disableWarnings
  };

  // Shim browser if found.
  switch (browserDetails.browser) {
    case 'chrome':
      if (!chromeShim || !chromeShim.shimPeerConnection ||
          !options.shimChrome) {
        logging('Chrome shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming chrome.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = chromeShim;
      commonShim.shimCreateObjectURL(window);

      chromeShim.shimGetUserMedia(window);
      chromeShim.shimMediaStream(window);
      chromeShim.shimSourceObject(window);
      chromeShim.shimPeerConnection(window);
      chromeShim.shimOnTrack(window);
      chromeShim.shimAddTrackRemoveTrack(window);
      chromeShim.shimGetSendersWithDtmf(window);
      chromeShim.shimSenderReceiverGetStats(window);
      chromeShim.fixNegotiationNeeded(window);

      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    case 'firefox':
      if (!firefoxShim || !firefoxShim.shimPeerConnection ||
          !options.shimFirefox) {
        logging('Firefox shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming firefox.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = firefoxShim;
      commonShim.shimCreateObjectURL(window);

      firefoxShim.shimGetUserMedia(window);
      firefoxShim.shimSourceObject(window);
      firefoxShim.shimPeerConnection(window);
      firefoxShim.shimOnTrack(window);
      firefoxShim.shimRemoveStream(window);
      firefoxShim.shimSenderGetStats(window);
      firefoxShim.shimReceiverGetStats(window);
      firefoxShim.shimRTCDataChannel(window);

      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    case 'edge':
      if (!edgeShim || !edgeShim.shimPeerConnection || !options.shimEdge) {
        logging('MS edge shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming edge.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = edgeShim;
      commonShim.shimCreateObjectURL(window);

      edgeShim.shimGetUserMedia(window);
      edgeShim.shimPeerConnection(window);
      edgeShim.shimReplaceTrack(window);
      edgeShim.shimGetDisplayMedia(window);

      // the edge shim implements the full RTCIceCandidate object.

      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    case 'safari':
      if (!safariShim || !options.shimSafari) {
        logging('Safari shim is not included in this adapter release.');
        return adapter;
      }
      logging('adapter.js shimming safari.');
      // Export to the adapter global object visible in the browser.
      adapter.browserShim = safariShim;
      commonShim.shimCreateObjectURL(window);

      safariShim.shimRTCIceServerUrls(window);
      safariShim.shimCreateOfferLegacy(window);
      safariShim.shimCallbacksAPI(window);
      safariShim.shimLocalStreamsAPI(window);
      safariShim.shimRemoteStreamsAPI(window);
      safariShim.shimTrackEventTransceiver(window);
      safariShim.shimGetUserMedia(window);

      commonShim.shimRTCIceCandidate(window);
      commonShim.shimMaxMessageSize(window);
      commonShim.shimSendThrowTypeError(window);
      break;
    default:
      logging('Unsupported browser!');
      break;
  }

  return adapter;
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js":
/*!******************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/chrome/chrome_shim.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var utils = __webpack_require__(/*! ../utils.js */ "./node_modules/webrtc-adapter/src/js/utils.js");
var logging = utils.log;

/* iterates the stats graph recursively. */
function walkStats(stats, base, resultSet) {
  if (!base || resultSet.has(base.id)) {
    return;
  }
  resultSet.set(base.id, base);
  Object.keys(base).forEach(function(name) {
    if (name.endsWith('Id')) {
      walkStats(stats, stats.get(base[name]), resultSet);
    } else if (name.endsWith('Ids')) {
      base[name].forEach(function(id) {
        walkStats(stats, stats.get(id), resultSet);
      });
    }
  });
}

/* filter getStats for a sender/receiver track. */
function filterStats(result, track, outbound) {
  var streamStatsType = outbound ? 'outbound-rtp' : 'inbound-rtp';
  var filteredResult = new Map();
  if (track === null) {
    return filteredResult;
  }
  var trackStats = [];
  result.forEach(function(value) {
    if (value.type === 'track' &&
        value.trackIdentifier === track.id) {
      trackStats.push(value);
    }
  });
  trackStats.forEach(function(trackStat) {
    result.forEach(function(stats) {
      if (stats.type === streamStatsType && stats.trackId === trackStat.id) {
        walkStats(result, stats, filteredResult);
      }
    });
  });
  return filteredResult;
}

module.exports = {
  shimGetUserMedia: __webpack_require__(/*! ./getusermedia */ "./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js"),
  shimMediaStream: function(window) {
    window.MediaStream = window.MediaStream || window.webkitMediaStream;
  },

  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
          }
          this.addEventListener('track', this._ontrack = f);
        },
        enumerable: true,
        configurable: true
      });
      var origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function() {
        var pc = this;
        if (!pc._ontrackpoly) {
          pc._ontrackpoly = function(e) {
            // onaddstream does not fire when a track is added to an existing
            // stream. But stream.onaddtrack is implemented so we use that.
            e.stream.addEventListener('addtrack', function(te) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = pc.getReceivers().find(function(r) {
                  return r.track && r.track.id === te.track.id;
                });
              } else {
                receiver = {track: te.track};
              }

              var event = new Event('track');
              event.track = te.track;
              event.receiver = receiver;
              event.transceiver = {receiver: receiver};
              event.streams = [e.stream];
              pc.dispatchEvent(event);
            });
            e.stream.getTracks().forEach(function(track) {
              var receiver;
              if (window.RTCPeerConnection.prototype.getReceivers) {
                receiver = pc.getReceivers().find(function(r) {
                  return r.track && r.track.id === track.id;
                });
              } else {
                receiver = {track: track};
              }
              var event = new Event('track');
              event.track = track;
              event.receiver = receiver;
              event.transceiver = {receiver: receiver};
              event.streams = [e.stream];
              pc.dispatchEvent(event);
            });
          };
          pc.addEventListener('addstream', pc._ontrackpoly);
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    } else {
      // even if RTCRtpTransceiver is in window, it is only used and
      // emitted in unified-plan. Unfortunately this means we need
      // to unconditionally wrap the event.
      utils.wrapPeerConnectionEvent(window, 'track', function(e) {
        if (!e.transceiver) {
          Object.defineProperty(e, 'transceiver',
            {value: {receiver: e.receiver}});
        }
        return e;
      });
    }
  },

  shimGetSendersWithDtmf: function(window) {
    // Overrides addTrack/removeTrack, depends on shimAddTrackRemoveTrack.
    if (typeof window === 'object' && window.RTCPeerConnection &&
        !('getSenders' in window.RTCPeerConnection.prototype) &&
        'createDTMFSender' in window.RTCPeerConnection.prototype) {
      var shimSenderWithDtmf = function(pc, track) {
        return {
          track: track,
          get dtmf() {
            if (this._dtmf === undefined) {
              if (track.kind === 'audio') {
                this._dtmf = pc.createDTMFSender(track);
              } else {
                this._dtmf = null;
              }
            }
            return this._dtmf;
          },
          _pc: pc
        };
      };

      // augment addTrack when getSenders is not available.
      if (!window.RTCPeerConnection.prototype.getSenders) {
        window.RTCPeerConnection.prototype.getSenders = function() {
          this._senders = this._senders || [];
          return this._senders.slice(); // return a copy of the internal state.
        };
        var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
        window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
          var pc = this;
          var sender = origAddTrack.apply(pc, arguments);
          if (!sender) {
            sender = shimSenderWithDtmf(pc, track);
            pc._senders.push(sender);
          }
          return sender;
        };

        var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
        window.RTCPeerConnection.prototype.removeTrack = function(sender) {
          var pc = this;
          origRemoveTrack.apply(pc, arguments);
          var idx = pc._senders.indexOf(sender);
          if (idx !== -1) {
            pc._senders.splice(idx, 1);
          }
        };
      }
      var origAddStream = window.RTCPeerConnection.prototype.addStream;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origAddStream.apply(pc, [stream]);
        stream.getTracks().forEach(function(track) {
          pc._senders.push(shimSenderWithDtmf(pc, track));
        });
      };

      var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        var pc = this;
        pc._senders = pc._senders || [];
        origRemoveStream.apply(pc, [stream]);

        stream.getTracks().forEach(function(track) {
          var sender = pc._senders.find(function(s) {
            return s.track === track;
          });
          if (sender) {
            pc._senders.splice(pc._senders.indexOf(sender), 1); // remove sender
          }
        });
      };
    } else if (typeof window === 'object' && window.RTCPeerConnection &&
               'getSenders' in window.RTCPeerConnection.prototype &&
               'createDTMFSender' in window.RTCPeerConnection.prototype &&
               window.RTCRtpSender &&
               !('dtmf' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      window.RTCPeerConnection.prototype.getSenders = function() {
        var pc = this;
        var senders = origGetSenders.apply(pc, []);
        senders.forEach(function(sender) {
          sender._pc = pc;
        });
        return senders;
      };

      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = this._pc.createDTMFSender(this.track);
            } else {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
  },

  shimSenderReceiverGetStats: function(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection &&
        window.RTCRtpSender && window.RTCRtpReceiver)) {
      return;
    }

    // shim sender stats.
    if (!('getStats' in window.RTCRtpSender.prototype)) {
      var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
      if (origGetSenders) {
        window.RTCPeerConnection.prototype.getSenders = function() {
          var pc = this;
          var senders = origGetSenders.apply(pc, []);
          senders.forEach(function(sender) {
            sender._pc = pc;
          });
          return senders;
        };
      }

      var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
      if (origAddTrack) {
        window.RTCPeerConnection.prototype.addTrack = function() {
          var sender = origAddTrack.apply(this, arguments);
          sender._pc = this;
          return sender;
        };
      }
      window.RTCRtpSender.prototype.getStats = function() {
        var sender = this;
        return this._pc.getStats().then(function(result) {
          /* Note: this will include stats of all senders that
           *   send a track with the same id as sender.track as
           *   it is not possible to identify the RTCRtpSender.
           */
          return filterStats(result, sender.track, true);
        });
      };
    }

    // shim receiver stats.
    if (!('getStats' in window.RTCRtpReceiver.prototype)) {
      var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
      if (origGetReceivers) {
        window.RTCPeerConnection.prototype.getReceivers = function() {
          var pc = this;
          var receivers = origGetReceivers.apply(pc, []);
          receivers.forEach(function(receiver) {
            receiver._pc = pc;
          });
          return receivers;
        };
      }
      utils.wrapPeerConnectionEvent(window, 'track', function(e) {
        e.receiver._pc = e.srcElement;
        return e;
      });
      window.RTCRtpReceiver.prototype.getStats = function() {
        var receiver = this;
        return this._pc.getStats().then(function(result) {
          return filterStats(result, receiver.track, false);
        });
      };
    }

    if (!('getStats' in window.RTCRtpSender.prototype &&
        'getStats' in window.RTCRtpReceiver.prototype)) {
      return;
    }

    // shim RTCPeerConnection.getStats(track).
    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function() {
      var pc = this;
      if (arguments.length > 0 &&
          arguments[0] instanceof window.MediaStreamTrack) {
        var track = arguments[0];
        var sender;
        var receiver;
        var err;
        pc.getSenders().forEach(function(s) {
          if (s.track === track) {
            if (sender) {
              err = true;
            } else {
              sender = s;
            }
          }
        });
        pc.getReceivers().forEach(function(r) {
          if (r.track === track) {
            if (receiver) {
              err = true;
            } else {
              receiver = r;
            }
          }
          return r.track === track;
        });
        if (err || (sender && receiver)) {
          return Promise.reject(new DOMException(
            'There are more than one sender or receiver for the track.',
            'InvalidAccessError'));
        } else if (sender) {
          return sender.getStats();
        } else if (receiver) {
          return receiver.getStats();
        }
        return Promise.reject(new DOMException(
          'There is no sender or receiver for the track.',
          'InvalidAccessError'));
      }
      return origGetStats.apply(pc, arguments);
    };
  },

  shimSourceObject: function(window) {
    var URL = window && window.URL;

    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this._srcObject;
          },
          set: function(stream) {
            var self = this;
            // Use _srcObject as a private property for this shim
            this._srcObject = stream;
            if (this.src) {
              URL.revokeObjectURL(this.src);
            }

            if (!stream) {
              this.src = '';
              return undefined;
            }
            this.src = URL.createObjectURL(stream);
            // We need to recreate the blob url when a track is added or
            // removed. Doing it manually since we want to avoid a recursion.
            stream.addEventListener('addtrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
            stream.addEventListener('removetrack', function() {
              if (self.src) {
                URL.revokeObjectURL(self.src);
              }
              self.src = URL.createObjectURL(stream);
            });
          }
        });
      }
    }
  },

  shimAddTrackRemoveTrackWithNative: function(window) {
    // shim addTrack/removeTrack with native variants in order to make
    // the interactions with legacy getLocalStreams behave as in other browsers.
    // Keeps a mapping stream.id => [stream, rtpsenders...]
    window.RTCPeerConnection.prototype.getLocalStreams = function() {
      var pc = this;
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      return Object.keys(this._shimmedLocalStreams).map(function(streamId) {
        return pc._shimmedLocalStreams[streamId][0];
      });
    };

    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
      if (!stream) {
        return origAddTrack.apply(this, arguments);
      }
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      var sender = origAddTrack.apply(this, arguments);
      if (!this._shimmedLocalStreams[stream.id]) {
        this._shimmedLocalStreams[stream.id] = [stream, sender];
      } else if (this._shimmedLocalStreams[stream.id].indexOf(sender) === -1) {
        this._shimmedLocalStreams[stream.id].push(sender);
      }
      return sender;
    };

    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};

      stream.getTracks().forEach(function(track) {
        var alreadyExists = pc.getSenders().find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
              'InvalidAccessError');
        }
      });
      var existingSenders = pc.getSenders();
      origAddStream.apply(this, arguments);
      var newSenders = pc.getSenders().filter(function(newSender) {
        return existingSenders.indexOf(newSender) === -1;
      });
      this._shimmedLocalStreams[stream.id] = [stream].concat(newSenders);
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      delete this._shimmedLocalStreams[stream.id];
      return origRemoveStream.apply(this, arguments);
    };

    var origRemoveTrack = window.RTCPeerConnection.prototype.removeTrack;
    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
      var pc = this;
      this._shimmedLocalStreams = this._shimmedLocalStreams || {};
      if (sender) {
        Object.keys(this._shimmedLocalStreams).forEach(function(streamId) {
          var idx = pc._shimmedLocalStreams[streamId].indexOf(sender);
          if (idx !== -1) {
            pc._shimmedLocalStreams[streamId].splice(idx, 1);
          }
          if (pc._shimmedLocalStreams[streamId].length === 1) {
            delete pc._shimmedLocalStreams[streamId];
          }
        });
      }
      return origRemoveTrack.apply(this, arguments);
    };
  },

  shimAddTrackRemoveTrack: function(window) {
    if (!window.RTCPeerConnection) {
      return;
    }
    var browserDetails = utils.detectBrowser(window);
    // shim addTrack and removeTrack.
    if (window.RTCPeerConnection.prototype.addTrack &&
        browserDetails.version >= 65) {
      return this.shimAddTrackRemoveTrackWithNative(window);
    }

    // also shim pc.getLocalStreams when addTrack is shimmed
    // to return the original streams.
    var origGetLocalStreams = window.RTCPeerConnection.prototype
        .getLocalStreams;
    window.RTCPeerConnection.prototype.getLocalStreams = function() {
      var pc = this;
      var nativeStreams = origGetLocalStreams.apply(this);
      pc._reverseStreams = pc._reverseStreams || {};
      return nativeStreams.map(function(stream) {
        return pc._reverseStreams[stream.id];
      });
    };

    var origAddStream = window.RTCPeerConnection.prototype.addStream;
    window.RTCPeerConnection.prototype.addStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      stream.getTracks().forEach(function(track) {
        var alreadyExists = pc.getSenders().find(function(s) {
          return s.track === track;
        });
        if (alreadyExists) {
          throw new DOMException('Track already exists.',
              'InvalidAccessError');
        }
      });
      // Add identity mapping for consistency with addTrack.
      // Unless this is being used with a stream from addTrack.
      if (!pc._reverseStreams[stream.id]) {
        var newStream = new window.MediaStream(stream.getTracks());
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        stream = newStream;
      }
      origAddStream.apply(pc, [stream]);
    };

    var origRemoveStream = window.RTCPeerConnection.prototype.removeStream;
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};

      origRemoveStream.apply(pc, [(pc._streams[stream.id] || stream)]);
      delete pc._reverseStreams[(pc._streams[stream.id] ?
          pc._streams[stream.id].id : stream.id)];
      delete pc._streams[stream.id];
    };

    window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      var streams = [].slice.call(arguments, 1);
      if (streams.length !== 1 ||
          !streams[0].getTracks().find(function(t) {
            return t === track;
          })) {
        // this is not fully correct but all we can manage without
        // [[associated MediaStreams]] internal slot.
        throw new DOMException(
          'The adapter.js addTrack polyfill only supports a single ' +
          ' stream which is associated with the specified track.',
          'NotSupportedError');
      }

      var alreadyExists = pc.getSenders().find(function(s) {
        return s.track === track;
      });
      if (alreadyExists) {
        throw new DOMException('Track already exists.',
            'InvalidAccessError');
      }

      pc._streams = pc._streams || {};
      pc._reverseStreams = pc._reverseStreams || {};
      var oldStream = pc._streams[stream.id];
      if (oldStream) {
        // this is using odd Chrome behaviour, use with caution:
        // https://bugs.chromium.org/p/webrtc/issues/detail?id=7815
        // Note: we rely on the high-level addTrack/dtmf shim to
        // create the sender with a dtmf sender.
        oldStream.addTrack(track);

        // Trigger ONN async.
        Promise.resolve().then(function() {
          pc.dispatchEvent(new Event('negotiationneeded'));
        });
      } else {
        var newStream = new window.MediaStream([track]);
        pc._streams[stream.id] = newStream;
        pc._reverseStreams[newStream.id] = stream;
        pc.addStream(newStream);
      }
      return pc.getSenders().find(function(s) {
        return s.track === track;
      });
    };

    // replace the internal stream id with the external one and
    // vice versa.
    function replaceInternalStreamId(pc, description) {
      var sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
        var externalStream = pc._reverseStreams[internalId];
        var internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(internalStream.id, 'g'),
            externalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp
      });
    }
    function replaceExternalStreamId(pc, description) {
      var sdp = description.sdp;
      Object.keys(pc._reverseStreams || []).forEach(function(internalId) {
        var externalStream = pc._reverseStreams[internalId];
        var internalStream = pc._streams[externalStream.id];
        sdp = sdp.replace(new RegExp(externalStream.id, 'g'),
            internalStream.id);
      });
      return new RTCSessionDescription({
        type: description.type,
        sdp: sdp
      });
    }
    ['createOffer', 'createAnswer'].forEach(function(method) {
      var nativeMethod = window.RTCPeerConnection.prototype[method];
      window.RTCPeerConnection.prototype[method] = function() {
        var pc = this;
        var args = arguments;
        var isLegacyCall = arguments.length &&
            typeof arguments[0] === 'function';
        if (isLegacyCall) {
          return nativeMethod.apply(pc, [
            function(description) {
              var desc = replaceInternalStreamId(pc, description);
              args[0].apply(null, [desc]);
            },
            function(err) {
              if (args[1]) {
                args[1].apply(null, err);
              }
            }, arguments[2]
          ]);
        }
        return nativeMethod.apply(pc, arguments)
        .then(function(description) {
          return replaceInternalStreamId(pc, description);
        });
      };
    });

    var origSetLocalDescription =
        window.RTCPeerConnection.prototype.setLocalDescription;
    window.RTCPeerConnection.prototype.setLocalDescription = function() {
      var pc = this;
      if (!arguments.length || !arguments[0].type) {
        return origSetLocalDescription.apply(pc, arguments);
      }
      arguments[0] = replaceExternalStreamId(pc, arguments[0]);
      return origSetLocalDescription.apply(pc, arguments);
    };

    // TODO: mangle getStats: https://w3c.github.io/webrtc-stats/#dom-rtcmediastreamstats-streamidentifier

    var origLocalDescription = Object.getOwnPropertyDescriptor(
        window.RTCPeerConnection.prototype, 'localDescription');
    Object.defineProperty(window.RTCPeerConnection.prototype,
        'localDescription', {
          get: function() {
            var pc = this;
            var description = origLocalDescription.get.apply(this);
            if (description.type === '') {
              return description;
            }
            return replaceInternalStreamId(pc, description);
          }
        });

    window.RTCPeerConnection.prototype.removeTrack = function(sender) {
      var pc = this;
      if (pc.signalingState === 'closed') {
        throw new DOMException(
          'The RTCPeerConnection\'s signalingState is \'closed\'.',
          'InvalidStateError');
      }
      // We can not yet check for sender instanceof RTCRtpSender
      // since we shim RTPSender. So we check if sender._pc is set.
      if (!sender._pc) {
        throw new DOMException('Argument 1 of RTCPeerConnection.removeTrack ' +
            'does not implement interface RTCRtpSender.', 'TypeError');
      }
      var isLocal = sender._pc === pc;
      if (!isLocal) {
        throw new DOMException('Sender was not created by this connection.',
            'InvalidAccessError');
      }

      // Search for the native stream the senders track belongs to.
      pc._streams = pc._streams || {};
      var stream;
      Object.keys(pc._streams).forEach(function(streamid) {
        var hasTrack = pc._streams[streamid].getTracks().find(function(track) {
          return sender.track === track;
        });
        if (hasTrack) {
          stream = pc._streams[streamid];
        }
      });

      if (stream) {
        if (stream.getTracks().length === 1) {
          // if this is the last track of the stream, remove the stream. This
          // takes care of any shimmed _senders.
          pc.removeStream(pc._reverseStreams[stream.id]);
        } else {
          // relying on the same odd chrome behaviour as above.
          stream.removeTrack(sender.track);
        }
        pc.dispatchEvent(new Event('negotiationneeded'));
      }
    };
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection && window.webkitRTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        // Translate iceTransportPolicy to iceTransports,
        // see https://code.google.com/p/webrtc/issues/detail?id=4869
        // this was fixed in M56 along with unprefixing RTCPeerConnection.
        logging('PeerConnection');
        if (pcConfig && pcConfig.iceTransportPolicy) {
          pcConfig.iceTransports = pcConfig.iceTransportPolicy;
        }

        return new window.webkitRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.webkitRTCPeerConnection.prototype;
      // wrap static methods. Currently just generateCertificate.
      if (window.webkitRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.webkitRTCPeerConnection.generateCertificate;
          }
        });
      }
    }
    if (!window.RTCPeerConnection) {
      return;
    }

    var origGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(selector,
        successCallback, errorCallback) {
      var pc = this;
      var args = arguments;

      // If selector is a function then we are in the old style stats so just
      // pass back the original getStats format to avoid breaking old users.
      if (arguments.length > 0 && typeof selector === 'function') {
        return origGetStats.apply(this, arguments);
      }

      // When spec-style getStats is supported, return those when called with
      // either no arguments or the selector argument is null.
      if (origGetStats.length === 0 && (arguments.length === 0 ||
          typeof arguments[0] !== 'function')) {
        return origGetStats.apply(this, []);
      }

      var fixChromeStats_ = function(response) {
        var standardReport = {};
        var reports = response.result();
        reports.forEach(function(report) {
          var standardStats = {
            id: report.id,
            timestamp: report.timestamp,
            type: {
              localcandidate: 'local-candidate',
              remotecandidate: 'remote-candidate'
            }[report.type] || report.type
          };
          report.names().forEach(function(name) {
            standardStats[name] = report.stat(name);
          });
          standardReport[standardStats.id] = standardStats;
        });

        return standardReport;
      };

      // shim getStats with maplike support
      var makeMapStats = function(stats) {
        return new Map(Object.keys(stats).map(function(key) {
          return [key, stats[key]];
        }));
      };

      if (arguments.length >= 2) {
        var successCallbackWrapper_ = function(response) {
          args[1](makeMapStats(fixChromeStats_(response)));
        };

        return origGetStats.apply(this, [successCallbackWrapper_,
          arguments[0]]);
      }

      // promise-support
      return new Promise(function(resolve, reject) {
        origGetStats.apply(pc, [
          function(response) {
            resolve(makeMapStats(fixChromeStats_(response)));
          }, reject]);
      }).then(successCallback, errorCallback);
    };

    // add promise support -- natively available in Chrome 51
    if (browserDetails.version < 51) {
      ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
          .forEach(function(method) {
            var nativeMethod = window.RTCPeerConnection.prototype[method];
            window.RTCPeerConnection.prototype[method] = function() {
              var args = arguments;
              var pc = this;
              var promise = new Promise(function(resolve, reject) {
                nativeMethod.apply(pc, [args[0], resolve, reject]);
              });
              if (args.length < 2) {
                return promise;
              }
              return promise.then(function() {
                args[1].apply(null, []);
              },
              function(err) {
                if (args.length >= 3) {
                  args[2].apply(null, [err]);
                }
              });
            };
          });
    }

    // promise support for createOffer and createAnswer. Available (without
    // bugs) since M52: crbug/619289
    if (browserDetails.version < 52) {
      ['createOffer', 'createAnswer'].forEach(function(method) {
        var nativeMethod = window.RTCPeerConnection.prototype[method];
        window.RTCPeerConnection.prototype[method] = function() {
          var pc = this;
          if (arguments.length < 1 || (arguments.length === 1 &&
              typeof arguments[0] === 'object')) {
            var opts = arguments.length === 1 ? arguments[0] : undefined;
            return new Promise(function(resolve, reject) {
              nativeMethod.apply(pc, [resolve, reject, opts]);
            });
          }
          return nativeMethod.apply(this, arguments);
        };
      });
    }

    // shim implicit creation of RTCSessionDescription/RTCIceCandidate
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };
  },

  fixNegotiationNeeded: function(window) {
    utils.wrapPeerConnectionEvent(window, 'negotiationneeded', function(e) {
      var pc = e.target;
      if (pc.signalingState !== 'stable') {
        return;
      }
      return e;
    });
  },

  shimGetDisplayMedia: function(window, getSourceId) {
    if (!window.navigator || !window.navigator.mediaDevices ||
        'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    // getSourceId is a function that returns a promise resolving with
    // the sourceId of the screen/window/tab to be shared.
    if (typeof getSourceId !== 'function') {
      console.error('shimGetDisplayMedia: getSourceId argument is not ' +
          'a function');
      return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function(constraints) {
      return getSourceId(constraints)
        .then(function(sourceId) {
          var widthSpecified = constraints.video && constraints.video.width;
          var heightSpecified = constraints.video && constraints.video.height;
          var frameRateSpecified = constraints.video &&
            constraints.video.frameRate;
          constraints.video = {
            mandatory: {
              chromeMediaSource: 'desktop',
              chromeMediaSourceId: sourceId,
              maxFrameRate: frameRateSpecified || 3
            }
          };
          if (widthSpecified) {
            constraints.video.mandatory.maxWidth = widthSpecified;
          }
          if (heightSpecified) {
            constraints.video.mandatory.maxHeight = heightSpecified;
          }
          return window.navigator.mediaDevices.getUserMedia(constraints);
        });
    };
    window.navigator.getDisplayMedia = function(constraints) {
      utils.deprecated('navigator.getDisplayMedia',
          'navigator.mediaDevices.getDisplayMedia');
      return window.navigator.mediaDevices.getDisplayMedia(constraints);
    };
  }
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js":
/*!*******************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/chrome/getusermedia.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */

var utils = __webpack_require__(/*! ../utils.js */ "./node_modules/webrtc-adapter/src/js/utils.js");
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;

  var constraintsToChrome_ = function(c) {
    if (typeof c !== 'object' || c.mandatory || c.optional) {
      return c;
    }
    var cc = {};
    Object.keys(c).forEach(function(key) {
      if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
        return;
      }
      var r = (typeof c[key] === 'object') ? c[key] : {ideal: c[key]};
      if (r.exact !== undefined && typeof r.exact === 'number') {
        r.min = r.max = r.exact;
      }
      var oldname_ = function(prefix, name) {
        if (prefix) {
          return prefix + name.charAt(0).toUpperCase() + name.slice(1);
        }
        return (name === 'deviceId') ? 'sourceId' : name;
      };
      if (r.ideal !== undefined) {
        cc.optional = cc.optional || [];
        var oc = {};
        if (typeof r.ideal === 'number') {
          oc[oldname_('min', key)] = r.ideal;
          cc.optional.push(oc);
          oc = {};
          oc[oldname_('max', key)] = r.ideal;
          cc.optional.push(oc);
        } else {
          oc[oldname_('', key)] = r.ideal;
          cc.optional.push(oc);
        }
      }
      if (r.exact !== undefined && typeof r.exact !== 'number') {
        cc.mandatory = cc.mandatory || {};
        cc.mandatory[oldname_('', key)] = r.exact;
      } else {
        ['min', 'max'].forEach(function(mix) {
          if (r[mix] !== undefined) {
            cc.mandatory = cc.mandatory || {};
            cc.mandatory[oldname_(mix, key)] = r[mix];
          }
        });
      }
    });
    if (c.advanced) {
      cc.optional = (cc.optional || []).concat(c.advanced);
    }
    return cc;
  };

  var shimConstraints_ = function(constraints, func) {
    if (browserDetails.version >= 61) {
      return func(constraints);
    }
    constraints = JSON.parse(JSON.stringify(constraints));
    if (constraints && typeof constraints.audio === 'object') {
      var remap = function(obj, a, b) {
        if (a in obj && !(b in obj)) {
          obj[b] = obj[a];
          delete obj[a];
        }
      };
      constraints = JSON.parse(JSON.stringify(constraints));
      remap(constraints.audio, 'autoGainControl', 'googAutoGainControl');
      remap(constraints.audio, 'noiseSuppression', 'googNoiseSuppression');
      constraints.audio = constraintsToChrome_(constraints.audio);
    }
    if (constraints && typeof constraints.video === 'object') {
      // Shim facingMode for mobile & surface pro.
      var face = constraints.video.facingMode;
      face = face && ((typeof face === 'object') ? face : {ideal: face});
      var getSupportedFacingModeLies = browserDetails.version < 66;

      if ((face && (face.exact === 'user' || face.exact === 'environment' ||
                    face.ideal === 'user' || face.ideal === 'environment')) &&
          !(navigator.mediaDevices.getSupportedConstraints &&
            navigator.mediaDevices.getSupportedConstraints().facingMode &&
            !getSupportedFacingModeLies)) {
        delete constraints.video.facingMode;
        var matches;
        if (face.exact === 'environment' || face.ideal === 'environment') {
          matches = ['back', 'rear'];
        } else if (face.exact === 'user' || face.ideal === 'user') {
          matches = ['front'];
        }
        if (matches) {
          // Look for matches in label, or use last cam for back (typical).
          return navigator.mediaDevices.enumerateDevices()
          .then(function(devices) {
            devices = devices.filter(function(d) {
              return d.kind === 'videoinput';
            });
            var dev = devices.find(function(d) {
              return matches.some(function(match) {
                return d.label.toLowerCase().indexOf(match) !== -1;
              });
            });
            if (!dev && devices.length && matches.indexOf('back') !== -1) {
              dev = devices[devices.length - 1]; // more likely the back cam
            }
            if (dev) {
              constraints.video.deviceId = face.exact ? {exact: dev.deviceId} :
                                                        {ideal: dev.deviceId};
            }
            constraints.video = constraintsToChrome_(constraints.video);
            logging('chrome: ' + JSON.stringify(constraints));
            return func(constraints);
          });
        }
      }
      constraints.video = constraintsToChrome_(constraints.video);
    }
    logging('chrome: ' + JSON.stringify(constraints));
    return func(constraints);
  };

  var shimError_ = function(e) {
    if (browserDetails.version >= 64) {
      return e;
    }
    return {
      name: {
        PermissionDeniedError: 'NotAllowedError',
        PermissionDismissedError: 'NotAllowedError',
        InvalidStateError: 'NotAllowedError',
        DevicesNotFoundError: 'NotFoundError',
        ConstraintNotSatisfiedError: 'OverconstrainedError',
        TrackStartError: 'NotReadableError',
        MediaDeviceFailedDueToShutdown: 'NotAllowedError',
        MediaDeviceKillSwitchOn: 'NotAllowedError',
        TabCaptureError: 'AbortError',
        ScreenCaptureError: 'AbortError',
        DeviceCaptureError: 'AbortError'
      }[e.name] || e.name,
      message: e.message,
      constraint: e.constraint || e.constraintName,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  var getUserMedia_ = function(constraints, onSuccess, onError) {
    shimConstraints_(constraints, function(c) {
      navigator.webkitGetUserMedia(c, onSuccess, function(e) {
        if (onError) {
          onError(shimError_(e));
        }
      });
    });
  };

  navigator.getUserMedia = getUserMedia_;

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      navigator.getUserMedia(constraints, resolve, reject);
    });
  };

  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {
      getUserMedia: getUserMediaPromise_,
      enumerateDevices: function() {
        return new Promise(function(resolve) {
          var kinds = {audio: 'audioinput', video: 'videoinput'};
          return window.MediaStreamTrack.getSources(function(devices) {
            resolve(devices.map(function(device) {
              return {label: device.label,
                kind: kinds[device.kind],
                deviceId: device.id,
                groupId: ''};
            }));
          });
        });
      },
      getSupportedConstraints: function() {
        return {
          deviceId: true, echoCancellation: true, facingMode: true,
          frameRate: true, height: true, width: true
        };
      }
    };
  }

  // A shim for getUserMedia method on the mediaDevices object.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (!navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia = function(constraints) {
      return getUserMediaPromise_(constraints);
    };
  } else {
    // Even though Chrome 45 has navigator.mediaDevices and a getUserMedia
    // function which returns a Promise, it does not accept spec-style
    // constraints.
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(cs) {
      return shimConstraints_(cs, function(c) {
        return origGetUserMedia(c).then(function(stream) {
          if (c.audio && !stream.getAudioTracks().length ||
              c.video && !stream.getVideoTracks().length) {
            stream.getTracks().forEach(function(track) {
              track.stop();
            });
            throw new DOMException('', 'NotFoundError');
          }
          return stream;
        }, function(e) {
          return Promise.reject(shimError_(e));
        });
      });
    };
  }

  // Dummy devicechange event methods.
  // TODO(KaptenJansson) remove once implemented in Chrome stable.
  if (typeof navigator.mediaDevices.addEventListener === 'undefined') {
    navigator.mediaDevices.addEventListener = function() {
      logging('Dummy mediaDevices.addEventListener called.');
    };
  }
  if (typeof navigator.mediaDevices.removeEventListener === 'undefined') {
    navigator.mediaDevices.removeEventListener = function() {
      logging('Dummy mediaDevices.removeEventListener called.');
    };
  }
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/common_shim.js":
/*!***********************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/common_shim.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var SDPUtils = __webpack_require__(/*! sdp */ "./node_modules/sdp/sdp.js");
var utils = __webpack_require__(/*! ./utils */ "./node_modules/webrtc-adapter/src/js/utils.js");

module.exports = {
  shimRTCIceCandidate: function(window) {
    // foundation is arbitrarily chosen as an indicator for full support for
    // https://w3c.github.io/webrtc-pc/#rtcicecandidate-interface
    if (!window.RTCIceCandidate || (window.RTCIceCandidate && 'foundation' in
        window.RTCIceCandidate.prototype)) {
      return;
    }

    var NativeRTCIceCandidate = window.RTCIceCandidate;
    window.RTCIceCandidate = function(args) {
      // Remove the a= which shouldn't be part of the candidate string.
      if (typeof args === 'object' && args.candidate &&
          args.candidate.indexOf('a=') === 0) {
        args = JSON.parse(JSON.stringify(args));
        args.candidate = args.candidate.substr(2);
      }

      if (args.candidate && args.candidate.length) {
        // Augment the native candidate with the parsed fields.
        var nativeCandidate = new NativeRTCIceCandidate(args);
        var parsedCandidate = SDPUtils.parseCandidate(args.candidate);
        var augmentedCandidate = Object.assign(nativeCandidate,
            parsedCandidate);

        // Add a serializer that does not serialize the extra attributes.
        augmentedCandidate.toJSON = function() {
          return {
            candidate: augmentedCandidate.candidate,
            sdpMid: augmentedCandidate.sdpMid,
            sdpMLineIndex: augmentedCandidate.sdpMLineIndex,
            usernameFragment: augmentedCandidate.usernameFragment,
          };
        };
        return augmentedCandidate;
      }
      return new NativeRTCIceCandidate(args);
    };
    window.RTCIceCandidate.prototype = NativeRTCIceCandidate.prototype;

    // Hook up the augmented candidate in onicecandidate and
    // addEventListener('icecandidate', ...)
    utils.wrapPeerConnectionEvent(window, 'icecandidate', function(e) {
      if (e.candidate) {
        Object.defineProperty(e, 'candidate', {
          value: new window.RTCIceCandidate(e.candidate),
          writable: 'false'
        });
      }
      return e;
    });
  },

  // shimCreateObjectURL must be called before shimSourceObject to avoid loop.

  shimCreateObjectURL: function(window) {
    var URL = window && window.URL;

    if (!(typeof window === 'object' && window.HTMLMediaElement &&
          'srcObject' in window.HTMLMediaElement.prototype &&
        URL.createObjectURL && URL.revokeObjectURL)) {
      // Only shim CreateObjectURL using srcObject if srcObject exists.
      return undefined;
    }

    var nativeCreateObjectURL = URL.createObjectURL.bind(URL);
    var nativeRevokeObjectURL = URL.revokeObjectURL.bind(URL);
    var streams = new Map(), newId = 0;

    URL.createObjectURL = function(stream) {
      if ('getTracks' in stream) {
        var url = 'polyblob:' + (++newId);
        streams.set(url, stream);
        utils.deprecated('URL.createObjectURL(stream)',
            'elem.srcObject = stream');
        return url;
      }
      return nativeCreateObjectURL(stream);
    };
    URL.revokeObjectURL = function(url) {
      nativeRevokeObjectURL(url);
      streams.delete(url);
    };

    var dsc = Object.getOwnPropertyDescriptor(window.HTMLMediaElement.prototype,
                                              'src');
    Object.defineProperty(window.HTMLMediaElement.prototype, 'src', {
      get: function() {
        return dsc.get.apply(this);
      },
      set: function(url) {
        this.srcObject = streams.get(url) || null;
        return dsc.set.apply(this, [url]);
      }
    });

    var nativeSetAttribute = window.HTMLMediaElement.prototype.setAttribute;
    window.HTMLMediaElement.prototype.setAttribute = function() {
      if (arguments.length === 2 &&
          ('' + arguments[0]).toLowerCase() === 'src') {
        this.srcObject = streams.get(arguments[1]) || null;
      }
      return nativeSetAttribute.apply(this, arguments);
    };
  },

  shimMaxMessageSize: function(window) {
    if (window.RTCSctpTransport || !window.RTCPeerConnection) {
      return;
    }
    var browserDetails = utils.detectBrowser(window);

    if (!('sctp' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'sctp', {
        get: function() {
          return typeof this._sctp === 'undefined' ? null : this._sctp;
        }
      });
    }

    var sctpInDescription = function(description) {
      var sections = SDPUtils.splitSections(description.sdp);
      sections.shift();
      return sections.some(function(mediaSection) {
        var mLine = SDPUtils.parseMLine(mediaSection);
        return mLine && mLine.kind === 'application'
            && mLine.protocol.indexOf('SCTP') !== -1;
      });
    };

    var getRemoteFirefoxVersion = function(description) {
      // TODO: Is there a better solution for detecting Firefox?
      var match = description.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
      if (match === null || match.length < 2) {
        return -1;
      }
      var version = parseInt(match[1], 10);
      // Test for NaN (yes, this is ugly)
      return version !== version ? -1 : version;
    };

    var getCanSendMaxMessageSize = function(remoteIsFirefox) {
      // Every implementation we know can send at least 64 KiB.
      // Note: Although Chrome is technically able to send up to 256 KiB, the
      //       data does not reach the other peer reliably.
      //       See: https://bugs.chromium.org/p/webrtc/issues/detail?id=8419
      var canSendMaxMessageSize = 65536;
      if (browserDetails.browser === 'firefox') {
        if (browserDetails.version < 57) {
          if (remoteIsFirefox === -1) {
            // FF < 57 will send in 16 KiB chunks using the deprecated PPID
            // fragmentation.
            canSendMaxMessageSize = 16384;
          } else {
            // However, other FF (and RAWRTC) can reassemble PPID-fragmented
            // messages. Thus, supporting ~2 GiB when sending.
            canSendMaxMessageSize = 2147483637;
          }
        } else if (browserDetails.version < 60) {
          // Currently, all FF >= 57 will reset the remote maximum message size
          // to the default value when a data channel is created at a later
          // stage. :(
          // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831
          canSendMaxMessageSize =
            browserDetails.version === 57 ? 65535 : 65536;
        } else {
          // FF >= 60 supports sending ~2 GiB
          canSendMaxMessageSize = 2147483637;
        }
      }
      return canSendMaxMessageSize;
    };

    var getMaxMessageSize = function(description, remoteIsFirefox) {
      // Note: 65536 bytes is the default value from the SDP spec. Also,
      //       every implementation we know supports receiving 65536 bytes.
      var maxMessageSize = 65536;

      // FF 57 has a slightly incorrect default remote max message size, so
      // we need to adjust it here to avoid a failure when sending.
      // See: https://bugzilla.mozilla.org/show_bug.cgi?id=1425697
      if (browserDetails.browser === 'firefox'
           && browserDetails.version === 57) {
        maxMessageSize = 65535;
      }

      var match = SDPUtils.matchPrefix(description.sdp, 'a=max-message-size:');
      if (match.length > 0) {
        maxMessageSize = parseInt(match[0].substr(19), 10);
      } else if (browserDetails.browser === 'firefox' &&
                  remoteIsFirefox !== -1) {
        // If the maximum message size is not present in the remote SDP and
        // both local and remote are Firefox, the remote peer can receive
        // ~2 GiB.
        maxMessageSize = 2147483637;
      }
      return maxMessageSize;
    };

    var origSetRemoteDescription =
        window.RTCPeerConnection.prototype.setRemoteDescription;
    window.RTCPeerConnection.prototype.setRemoteDescription = function() {
      var pc = this;
      pc._sctp = null;

      if (sctpInDescription(arguments[0])) {
        // Check if the remote is FF.
        var isFirefox = getRemoteFirefoxVersion(arguments[0]);

        // Get the maximum message size the local peer is capable of sending
        var canSendMMS = getCanSendMaxMessageSize(isFirefox);

        // Get the maximum message size of the remote peer.
        var remoteMMS = getMaxMessageSize(arguments[0], isFirefox);

        // Determine final maximum message size
        var maxMessageSize;
        if (canSendMMS === 0 && remoteMMS === 0) {
          maxMessageSize = Number.POSITIVE_INFINITY;
        } else if (canSendMMS === 0 || remoteMMS === 0) {
          maxMessageSize = Math.max(canSendMMS, remoteMMS);
        } else {
          maxMessageSize = Math.min(canSendMMS, remoteMMS);
        }

        // Create a dummy RTCSctpTransport object and the 'maxMessageSize'
        // attribute.
        var sctp = {};
        Object.defineProperty(sctp, 'maxMessageSize', {
          get: function() {
            return maxMessageSize;
          }
        });
        pc._sctp = sctp;
      }

      return origSetRemoteDescription.apply(pc, arguments);
    };
  },

  shimSendThrowTypeError: function(window) {
    if (!(window.RTCPeerConnection &&
        'createDataChannel' in window.RTCPeerConnection.prototype)) {
      return;
    }

    // Note: Although Firefox >= 57 has a native implementation, the maximum
    //       message size can be reset for all data channels at a later stage.
    //       See: https://bugzilla.mozilla.org/show_bug.cgi?id=1426831

    function wrapDcSend(dc, pc) {
      var origDataChannelSend = dc.send;
      dc.send = function() {
        var data = arguments[0];
        var length = data.length || data.size || data.byteLength;
        if (dc.readyState === 'open' &&
            pc.sctp && length > pc.sctp.maxMessageSize) {
          throw new TypeError('Message too large (can send a maximum of ' +
            pc.sctp.maxMessageSize + ' bytes)');
        }
        return origDataChannelSend.apply(dc, arguments);
      };
    }
    var origCreateDataChannel =
      window.RTCPeerConnection.prototype.createDataChannel;
    window.RTCPeerConnection.prototype.createDataChannel = function() {
      var pc = this;
      var dataChannel = origCreateDataChannel.apply(pc, arguments);
      wrapDcSend(dataChannel, pc);
      return dataChannel;
    };
    utils.wrapPeerConnectionEvent(window, 'datachannel', function(e) {
      wrapDcSend(e.channel, e.target);
      return e;
    });
  }
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/edge_shim.js":
/*!**************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/edge_shim.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
var filterIceServers = __webpack_require__(/*! ./filtericeservers */ "./node_modules/webrtc-adapter/src/js/edge/filtericeservers.js");
var shimRTCPeerConnection = __webpack_require__(/*! rtcpeerconnection-shim */ "./node_modules/rtcpeerconnection-shim/rtcpeerconnection.js");

module.exports = {
  shimGetUserMedia: __webpack_require__(/*! ./getusermedia */ "./node_modules/webrtc-adapter/src/js/edge/getusermedia.js"),
  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (window.RTCIceGatherer) {
      if (!window.RTCIceCandidate) {
        window.RTCIceCandidate = function(args) {
          return args;
        };
      }
      if (!window.RTCSessionDescription) {
        window.RTCSessionDescription = function(args) {
          return args;
        };
      }
      // this adds an additional event listener to MediaStrackTrack that signals
      // when a tracks enabled property was changed. Workaround for a bug in
      // addStream, see below. No longer required in 15025+
      if (browserDetails.version < 15025) {
        var origMSTEnabled = Object.getOwnPropertyDescriptor(
            window.MediaStreamTrack.prototype, 'enabled');
        Object.defineProperty(window.MediaStreamTrack.prototype, 'enabled', {
          set: function(value) {
            origMSTEnabled.set.call(this, value);
            var ev = new Event('enabled');
            ev.enabled = value;
            this.dispatchEvent(ev);
          }
        });
      }
    }

    // ORTC defines the DTMF sender a bit different.
    // https://github.com/w3c/ortc/issues/714
    if (window.RTCRtpSender && !('dtmf' in window.RTCRtpSender.prototype)) {
      Object.defineProperty(window.RTCRtpSender.prototype, 'dtmf', {
        get: function() {
          if (this._dtmf === undefined) {
            if (this.track.kind === 'audio') {
              this._dtmf = new window.RTCDtmfSender(this);
            } else if (this.track.kind === 'video') {
              this._dtmf = null;
            }
          }
          return this._dtmf;
        }
      });
    }
    // Edge currently only implements the RTCDtmfSender, not the
    // RTCDTMFSender alias. See http://draft.ortc.org/#rtcdtmfsender2*
    if (window.RTCDtmfSender && !window.RTCDTMFSender) {
      window.RTCDTMFSender = window.RTCDtmfSender;
    }

    var RTCPeerConnectionShim = shimRTCPeerConnection(window,
        browserDetails.version);
    window.RTCPeerConnection = function(config) {
      if (config && config.iceServers) {
        config.iceServers = filterIceServers(config.iceServers);
      }
      return new RTCPeerConnectionShim(config);
    };
    window.RTCPeerConnection.prototype = RTCPeerConnectionShim.prototype;
  },
  shimReplaceTrack: function(window) {
    // ORTC has replaceTrack -- https://github.com/w3c/ortc/issues/614
    if (window.RTCRtpSender &&
        !('replaceTrack' in window.RTCRtpSender.prototype)) {
      window.RTCRtpSender.prototype.replaceTrack =
          window.RTCRtpSender.prototype.setTrack;
    }
  },
  shimGetDisplayMedia: function(window, preferredMediaSource) {
    if (!('getDisplayMedia' in window.navigator) ||
        !window.navigator.mediaDevices ||
        'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    var origGetDisplayMedia = window.navigator.getDisplayMedia;
    window.navigator.mediaDevices.getDisplayMedia = function(constraints) {
      return origGetDisplayMedia.call(window.navigator, constraints);
    };
    window.navigator.getDisplayMedia = function(constraints) {
      utils.deprecated('navigator.getDisplayMedia',
          'navigator.mediaDevices.getDisplayMedia');
      return origGetDisplayMedia.call(window.navigator, constraints);
    };
  }
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/filtericeservers.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/filtericeservers.js ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
// Edge does not like
// 1) stun: filtered after 14393 unless ?transport=udp is present
// 2) turn: that does not have all of turn:host:port?transport=udp
// 3) turn: with ipv6 addresses
// 4) turn: occurring muliple times
module.exports = function(iceServers, edgeVersion) {
  var hasTurn = false;
  iceServers = JSON.parse(JSON.stringify(iceServers));
  return iceServers.filter(function(server) {
    if (server && (server.urls || server.url)) {
      var urls = server.urls || server.url;
      if (server.url && !server.urls) {
        utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
      }
      var isString = typeof urls === 'string';
      if (isString) {
        urls = [urls];
      }
      urls = urls.filter(function(url) {
        var validTurn = url.indexOf('turn:') === 0 &&
            url.indexOf('transport=udp') !== -1 &&
            url.indexOf('turn:[') === -1 &&
            !hasTurn;

        if (validTurn) {
          hasTurn = true;
          return true;
        }
        return url.indexOf('stun:') === 0 && edgeVersion >= 14393 &&
            url.indexOf('?transport=udp') === -1;
      });

      delete server.url;
      server.urls = isString ? urls[0] : urls;
      return !!urls.length;
    }
  });
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/edge/getusermedia.js":
/*!*****************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/edge/getusermedia.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


// Expose public methods.
module.exports = function(window) {
  var navigator = window && window.navigator;

  var shimError_ = function(e) {
    return {
      name: {PermissionDeniedError: 'NotAllowedError'}[e.name] || e.name,
      message: e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name;
      }
    };
  };

  // getUserMedia error shim.
  var origGetUserMedia = navigator.mediaDevices.getUserMedia.
      bind(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia = function(c) {
    return origGetUserMedia(c).catch(function(e) {
      return Promise.reject(shimError_(e));
    });
  };
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js":
/*!********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/firefox/firefox_shim.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");

module.exports = {
  shimGetUserMedia: __webpack_require__(/*! ./getusermedia */ "./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js"),
  shimOnTrack: function(window) {
    if (typeof window === 'object' && window.RTCPeerConnection && !('ontrack' in
        window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'ontrack', {
        get: function() {
          return this._ontrack;
        },
        set: function(f) {
          if (this._ontrack) {
            this.removeEventListener('track', this._ontrack);
            this.removeEventListener('addstream', this._ontrackpoly);
          }
          this.addEventListener('track', this._ontrack = f);
          this.addEventListener('addstream', this._ontrackpoly = function(e) {
            e.stream.getTracks().forEach(function(track) {
              var event = new Event('track');
              event.track = track;
              event.receiver = {track: track};
              event.transceiver = {receiver: event.receiver};
              event.streams = [e.stream];
              this.dispatchEvent(event);
            }.bind(this));
          }.bind(this));
        },
        enumerable: true,
        configurable: true
      });
    }
    if (typeof window === 'object' && window.RTCTrackEvent &&
        ('receiver' in window.RTCTrackEvent.prototype) &&
        !('transceiver' in window.RTCTrackEvent.prototype)) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get: function() {
          return {receiver: this.receiver};
        }
      });
    }
  },

  shimSourceObject: function(window) {
    // Firefox has supported mozSrcObject since FF22, unprefixed in 42.
    if (typeof window === 'object') {
      if (window.HTMLMediaElement &&
        !('srcObject' in window.HTMLMediaElement.prototype)) {
        // Shim the srcObject property, once, when HTMLMediaElement is found.
        Object.defineProperty(window.HTMLMediaElement.prototype, 'srcObject', {
          get: function() {
            return this.mozSrcObject;
          },
          set: function(stream) {
            this.mozSrcObject = stream;
          }
        });
      }
    }
  },

  shimPeerConnection: function(window) {
    var browserDetails = utils.detectBrowser(window);

    if (typeof window !== 'object' || !(window.RTCPeerConnection ||
        window.mozRTCPeerConnection)) {
      return; // probably media.peerconnection.enabled=false in about:config
    }
    // The RTCPeerConnection object.
    if (!window.RTCPeerConnection) {
      window.RTCPeerConnection = function(pcConfig, pcConstraints) {
        if (browserDetails.version < 38) {
          // .urls is not supported in FF < 38.
          // create RTCIceServers with a single url.
          if (pcConfig && pcConfig.iceServers) {
            var newIceServers = [];
            for (var i = 0; i < pcConfig.iceServers.length; i++) {
              var server = pcConfig.iceServers[i];
              if (server.hasOwnProperty('urls')) {
                for (var j = 0; j < server.urls.length; j++) {
                  var newServer = {
                    url: server.urls[j]
                  };
                  if (server.urls[j].indexOf('turn') === 0) {
                    newServer.username = server.username;
                    newServer.credential = server.credential;
                  }
                  newIceServers.push(newServer);
                }
              } else {
                newIceServers.push(pcConfig.iceServers[i]);
              }
            }
            pcConfig.iceServers = newIceServers;
          }
        }
        return new window.mozRTCPeerConnection(pcConfig, pcConstraints);
      };
      window.RTCPeerConnection.prototype =
          window.mozRTCPeerConnection.prototype;

      // wrap static methods. Currently just generateCertificate.
      if (window.mozRTCPeerConnection.generateCertificate) {
        Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
          get: function() {
            return window.mozRTCPeerConnection.generateCertificate;
          }
        });
      }

      window.RTCSessionDescription = window.mozRTCSessionDescription;
      window.RTCIceCandidate = window.mozRTCIceCandidate;
    }

    // shim away need for obsolete RTCIceCandidate/RTCSessionDescription.
    ['setLocalDescription', 'setRemoteDescription', 'addIceCandidate']
        .forEach(function(method) {
          var nativeMethod = window.RTCPeerConnection.prototype[method];
          window.RTCPeerConnection.prototype[method] = function() {
            arguments[0] = new ((method === 'addIceCandidate') ?
                window.RTCIceCandidate :
                window.RTCSessionDescription)(arguments[0]);
            return nativeMethod.apply(this, arguments);
          };
        });

    // support for addIceCandidate(null or undefined)
    var nativeAddIceCandidate =
        window.RTCPeerConnection.prototype.addIceCandidate;
    window.RTCPeerConnection.prototype.addIceCandidate = function() {
      if (!arguments[0]) {
        if (arguments[1]) {
          arguments[1].apply(null);
        }
        return Promise.resolve();
      }
      return nativeAddIceCandidate.apply(this, arguments);
    };

    // shim getStats with maplike support
    var makeMapStats = function(stats) {
      var map = new Map();
      Object.keys(stats).forEach(function(key) {
        map.set(key, stats[key]);
        map[key] = stats[key];
      });
      return map;
    };

    var modernStatsTypes = {
      inboundrtp: 'inbound-rtp',
      outboundrtp: 'outbound-rtp',
      candidatepair: 'candidate-pair',
      localcandidate: 'local-candidate',
      remotecandidate: 'remote-candidate'
    };

    var nativeGetStats = window.RTCPeerConnection.prototype.getStats;
    window.RTCPeerConnection.prototype.getStats = function(
      selector,
      onSucc,
      onErr
    ) {
      return nativeGetStats.apply(this, [selector || null])
        .then(function(stats) {
          if (browserDetails.version < 48) {
            stats = makeMapStats(stats);
          }
          if (browserDetails.version < 53 && !onSucc) {
            // Shim only promise getStats with spec-hyphens in type names
            // Leave callback version alone; misc old uses of forEach before Map
            try {
              stats.forEach(function(stat) {
                stat.type = modernStatsTypes[stat.type] || stat.type;
              });
            } catch (e) {
              if (e.name !== 'TypeError') {
                throw e;
              }
              // Avoid TypeError: "type" is read-only, in old versions. 34-43ish
              stats.forEach(function(stat, i) {
                stats.set(i, Object.assign({}, stat, {
                  type: modernStatsTypes[stat.type] || stat.type
                }));
              });
            }
          }
          return stats;
        })
        .then(onSucc, onErr);
    };
  },

  shimSenderGetStats: function(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection &&
        window.RTCRtpSender)) {
      return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpSender.prototype) {
      return;
    }
    var origGetSenders = window.RTCPeerConnection.prototype.getSenders;
    if (origGetSenders) {
      window.RTCPeerConnection.prototype.getSenders = function() {
        var pc = this;
        var senders = origGetSenders.apply(pc, []);
        senders.forEach(function(sender) {
          sender._pc = pc;
        });
        return senders;
      };
    }

    var origAddTrack = window.RTCPeerConnection.prototype.addTrack;
    if (origAddTrack) {
      window.RTCPeerConnection.prototype.addTrack = function() {
        var sender = origAddTrack.apply(this, arguments);
        sender._pc = this;
        return sender;
      };
    }
    window.RTCRtpSender.prototype.getStats = function() {
      return this.track ? this._pc.getStats(this.track) :
          Promise.resolve(new Map());
    };
  },

  shimReceiverGetStats: function(window) {
    if (!(typeof window === 'object' && window.RTCPeerConnection &&
        window.RTCRtpSender)) {
      return;
    }
    if (window.RTCRtpSender && 'getStats' in window.RTCRtpReceiver.prototype) {
      return;
    }
    var origGetReceivers = window.RTCPeerConnection.prototype.getReceivers;
    if (origGetReceivers) {
      window.RTCPeerConnection.prototype.getReceivers = function() {
        var pc = this;
        var receivers = origGetReceivers.apply(pc, []);
        receivers.forEach(function(receiver) {
          receiver._pc = pc;
        });
        return receivers;
      };
    }
    utils.wrapPeerConnectionEvent(window, 'track', function(e) {
      e.receiver._pc = e.srcElement;
      return e;
    });
    window.RTCRtpReceiver.prototype.getStats = function() {
      return this._pc.getStats(this.track);
    };
  },

  shimRemoveStream: function(window) {
    if (!window.RTCPeerConnection ||
        'removeStream' in window.RTCPeerConnection.prototype) {
      return;
    }
    window.RTCPeerConnection.prototype.removeStream = function(stream) {
      var pc = this;
      utils.deprecated('removeStream', 'removeTrack');
      this.getSenders().forEach(function(sender) {
        if (sender.track && stream.getTracks().indexOf(sender.track) !== -1) {
          pc.removeTrack(sender);
        }
      });
    };
  },

  shimRTCDataChannel: function(window) {
    // rename DataChannel to RTCDataChannel (native fix in FF60):
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1173851
    if (window.DataChannel && !window.RTCDataChannel) {
      window.RTCDataChannel = window.DataChannel;
    }
  },

  shimGetDisplayMedia: function(window, preferredMediaSource) {
    if (!window.navigator || !window.navigator.mediaDevices ||
        'getDisplayMedia' in window.navigator.mediaDevices) {
      return;
    }
    window.navigator.mediaDevices.getDisplayMedia = function(constraints) {
      if (!(constraints && constraints.video)) {
        var err = new DOMException('getDisplayMedia without video ' +
            'constraints is undefined');
        err.name = 'NotFoundError';
        // from https://heycam.github.io/webidl/#idl-DOMException-error-names
        err.code = 8;
        return Promise.reject(err);
      }
      if (constraints.video === true) {
        constraints.video = {mediaSource: preferredMediaSource};
      } else {
        constraints.video.mediaSource = preferredMediaSource;
      }
      return window.navigator.mediaDevices.getUserMedia(constraints);
    };
    window.navigator.getDisplayMedia = function(constraints) {
      utils.deprecated('navigator.getDisplayMedia',
          'navigator.mediaDevices.getDisplayMedia');
      return window.navigator.mediaDevices.getDisplayMedia(constraints);
    };
  }
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js":
/*!********************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/firefox/getusermedia.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var utils = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");
var logging = utils.log;

// Expose public methods.
module.exports = function(window) {
  var browserDetails = utils.detectBrowser(window);
  var navigator = window && window.navigator;
  var MediaStreamTrack = window && window.MediaStreamTrack;

  var shimError_ = function(e) {
    return {
      name: {
        InternalError: 'NotReadableError',
        NotSupportedError: 'TypeError',
        PermissionDeniedError: 'NotAllowedError',
        SecurityError: 'NotAllowedError'
      }[e.name] || e.name,
      message: {
        'The operation is insecure.': 'The request is not allowed by the ' +
        'user agent or the platform in the current context.'
      }[e.message] || e.message,
      constraint: e.constraint,
      toString: function() {
        return this.name + (this.message && ': ') + this.message;
      }
    };
  };

  // getUserMedia constraints shim.
  var getUserMedia_ = function(constraints, onSuccess, onError) {
    var constraintsToFF37_ = function(c) {
      if (typeof c !== 'object' || c.require) {
        return c;
      }
      var require = [];
      Object.keys(c).forEach(function(key) {
        if (key === 'require' || key === 'advanced' || key === 'mediaSource') {
          return;
        }
        var r = c[key] = (typeof c[key] === 'object') ?
            c[key] : {ideal: c[key]};
        if (r.min !== undefined ||
            r.max !== undefined || r.exact !== undefined) {
          require.push(key);
        }
        if (r.exact !== undefined) {
          if (typeof r.exact === 'number') {
            r. min = r.max = r.exact;
          } else {
            c[key] = r.exact;
          }
          delete r.exact;
        }
        if (r.ideal !== undefined) {
          c.advanced = c.advanced || [];
          var oc = {};
          if (typeof r.ideal === 'number') {
            oc[key] = {min: r.ideal, max: r.ideal};
          } else {
            oc[key] = r.ideal;
          }
          c.advanced.push(oc);
          delete r.ideal;
          if (!Object.keys(r).length) {
            delete c[key];
          }
        }
      });
      if (require.length) {
        c.require = require;
      }
      return c;
    };
    constraints = JSON.parse(JSON.stringify(constraints));
    if (browserDetails.version < 38) {
      logging('spec: ' + JSON.stringify(constraints));
      if (constraints.audio) {
        constraints.audio = constraintsToFF37_(constraints.audio);
      }
      if (constraints.video) {
        constraints.video = constraintsToFF37_(constraints.video);
      }
      logging('ff37: ' + JSON.stringify(constraints));
    }
    return navigator.mozGetUserMedia(constraints, onSuccess, function(e) {
      onError(shimError_(e));
    });
  };

  // Returns the result of getUserMedia as a Promise.
  var getUserMediaPromise_ = function(constraints) {
    return new Promise(function(resolve, reject) {
      getUserMedia_(constraints, resolve, reject);
    });
  };

  // Shim for mediaDevices on older versions.
  if (!navigator.mediaDevices) {
    navigator.mediaDevices = {getUserMedia: getUserMediaPromise_,
      addEventListener: function() { },
      removeEventListener: function() { }
    };
  }
  navigator.mediaDevices.enumerateDevices =
      navigator.mediaDevices.enumerateDevices || function() {
        return new Promise(function(resolve) {
          var infos = [
            {kind: 'audioinput', deviceId: 'default', label: '', groupId: ''},
            {kind: 'videoinput', deviceId: 'default', label: '', groupId: ''}
          ];
          resolve(infos);
        });
      };

  if (browserDetails.version < 41) {
    // Work around http://bugzil.la/1169665
    var orgEnumerateDevices =
        navigator.mediaDevices.enumerateDevices.bind(navigator.mediaDevices);
    navigator.mediaDevices.enumerateDevices = function() {
      return orgEnumerateDevices().then(undefined, function(e) {
        if (e.name === 'NotFoundError') {
          return [];
        }
        throw e;
      });
    };
  }
  if (browserDetails.version < 49) {
    var origGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      return origGetUserMedia(c).then(function(stream) {
        // Work around https://bugzil.la/802326
        if (c.audio && !stream.getAudioTracks().length ||
            c.video && !stream.getVideoTracks().length) {
          stream.getTracks().forEach(function(track) {
            track.stop();
          });
          throw new DOMException('The object can not be found here.',
                                 'NotFoundError');
        }
        return stream;
      }, function(e) {
        return Promise.reject(shimError_(e));
      });
    };
  }
  if (!(browserDetails.version > 55 &&
      'autoGainControl' in navigator.mediaDevices.getSupportedConstraints())) {
    var remap = function(obj, a, b) {
      if (a in obj && !(b in obj)) {
        obj[b] = obj[a];
        delete obj[a];
      }
    };

    var nativeGetUserMedia = navigator.mediaDevices.getUserMedia.
        bind(navigator.mediaDevices);
    navigator.mediaDevices.getUserMedia = function(c) {
      if (typeof c === 'object' && typeof c.audio === 'object') {
        c = JSON.parse(JSON.stringify(c));
        remap(c.audio, 'autoGainControl', 'mozAutoGainControl');
        remap(c.audio, 'noiseSuppression', 'mozNoiseSuppression');
      }
      return nativeGetUserMedia(c);
    };

    if (MediaStreamTrack && MediaStreamTrack.prototype.getSettings) {
      var nativeGetSettings = MediaStreamTrack.prototype.getSettings;
      MediaStreamTrack.prototype.getSettings = function() {
        var obj = nativeGetSettings.apply(this, arguments);
        remap(obj, 'mozAutoGainControl', 'autoGainControl');
        remap(obj, 'mozNoiseSuppression', 'noiseSuppression');
        return obj;
      };
    }

    if (MediaStreamTrack && MediaStreamTrack.prototype.applyConstraints) {
      var nativeApplyConstraints = MediaStreamTrack.prototype.applyConstraints;
      MediaStreamTrack.prototype.applyConstraints = function(c) {
        if (this.kind === 'audio' && typeof c === 'object') {
          c = JSON.parse(JSON.stringify(c));
          remap(c, 'autoGainControl', 'mozAutoGainControl');
          remap(c, 'noiseSuppression', 'mozNoiseSuppression');
        }
        return nativeApplyConstraints.apply(this, [c]);
      };
    }
  }
  navigator.getUserMedia = function(constraints, onSuccess, onError) {
    if (browserDetails.version < 44) {
      return getUserMedia_(constraints, onSuccess, onError);
    }
    // Replace Firefox 44+'s deprecation warning with unprefixed version.
    utils.deprecated('navigator.getUserMedia',
        'navigator.mediaDevices.getUserMedia');
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
  };
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/safari/safari_shim.js":
/*!******************************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/safari/safari_shim.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

var utils = __webpack_require__(/*! ../utils */ "./node_modules/webrtc-adapter/src/js/utils.js");

module.exports = {
  shimLocalStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getLocalStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getLocalStreams = function() {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        return this._localStreams;
      };
    }
    if (!('getStreamById' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getStreamById = function(id) {
        var result = null;
        if (this._localStreams) {
          this._localStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        if (this._remoteStreams) {
          this._remoteStreams.forEach(function(stream) {
            if (stream.id === id) {
              result = stream;
            }
          });
        }
        return result;
      };
    }
    if (!('addStream' in window.RTCPeerConnection.prototype)) {
      var _addTrack = window.RTCPeerConnection.prototype.addTrack;
      window.RTCPeerConnection.prototype.addStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        if (this._localStreams.indexOf(stream) === -1) {
          this._localStreams.push(stream);
        }
        var pc = this;
        stream.getTracks().forEach(function(track) {
          _addTrack.call(pc, track, stream);
        });
      };

      window.RTCPeerConnection.prototype.addTrack = function(track, stream) {
        if (stream) {
          if (!this._localStreams) {
            this._localStreams = [stream];
          } else if (this._localStreams.indexOf(stream) === -1) {
            this._localStreams.push(stream);
          }
        }
        return _addTrack.call(this, track, stream);
      };
    }
    if (!('removeStream' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.removeStream = function(stream) {
        if (!this._localStreams) {
          this._localStreams = [];
        }
        var index = this._localStreams.indexOf(stream);
        if (index === -1) {
          return;
        }
        this._localStreams.splice(index, 1);
        var pc = this;
        var tracks = stream.getTracks();
        this.getSenders().forEach(function(sender) {
          if (tracks.indexOf(sender.track) !== -1) {
            pc.removeTrack(sender);
          }
        });
      };
    }
  },
  shimRemoteStreamsAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    if (!('getRemoteStreams' in window.RTCPeerConnection.prototype)) {
      window.RTCPeerConnection.prototype.getRemoteStreams = function() {
        return this._remoteStreams ? this._remoteStreams : [];
      };
    }
    if (!('onaddstream' in window.RTCPeerConnection.prototype)) {
      Object.defineProperty(window.RTCPeerConnection.prototype, 'onaddstream', {
        get: function() {
          return this._onaddstream;
        },
        set: function(f) {
          if (this._onaddstream) {
            this.removeEventListener('addstream', this._onaddstream);
          }
          this.addEventListener('addstream', this._onaddstream = f);
        }
      });
      var origSetRemoteDescription =
          window.RTCPeerConnection.prototype.setRemoteDescription;
      window.RTCPeerConnection.prototype.setRemoteDescription = function() {
        var pc = this;
        if (!this._onaddstreampoly) {
          this.addEventListener('track', this._onaddstreampoly = function(e) {
            e.streams.forEach(function(stream) {
              if (!pc._remoteStreams) {
                pc._remoteStreams = [];
              }
              if (pc._remoteStreams.indexOf(stream) >= 0) {
                return;
              }
              pc._remoteStreams.push(stream);
              var event = new Event('addstream');
              event.stream = stream;
              pc.dispatchEvent(event);
            });
          });
        }
        return origSetRemoteDescription.apply(pc, arguments);
      };
    }
  },
  shimCallbacksAPI: function(window) {
    if (typeof window !== 'object' || !window.RTCPeerConnection) {
      return;
    }
    var prototype = window.RTCPeerConnection.prototype;
    var createOffer = prototype.createOffer;
    var createAnswer = prototype.createAnswer;
    var setLocalDescription = prototype.setLocalDescription;
    var setRemoteDescription = prototype.setRemoteDescription;
    var addIceCandidate = prototype.addIceCandidate;

    prototype.createOffer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createOffer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    prototype.createAnswer = function(successCallback, failureCallback) {
      var options = (arguments.length >= 2) ? arguments[2] : arguments[0];
      var promise = createAnswer.apply(this, [options]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };

    var withCallback = function(description, successCallback, failureCallback) {
      var promise = setLocalDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setLocalDescription = withCallback;

    withCallback = function(description, successCallback, failureCallback) {
      var promise = setRemoteDescription.apply(this, [description]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.setRemoteDescription = withCallback;

    withCallback = function(candidate, successCallback, failureCallback) {
      var promise = addIceCandidate.apply(this, [candidate]);
      if (!failureCallback) {
        return promise;
      }
      promise.then(successCallback, failureCallback);
      return Promise.resolve();
    };
    prototype.addIceCandidate = withCallback;
  },
  shimGetUserMedia: function(window) {
    var navigator = window && window.navigator;

    if (!navigator.getUserMedia) {
      if (navigator.webkitGetUserMedia) {
        navigator.getUserMedia = navigator.webkitGetUserMedia.bind(navigator);
      } else if (navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia) {
        navigator.getUserMedia = function(constraints, cb, errcb) {
          navigator.mediaDevices.getUserMedia(constraints)
          .then(cb, errcb);
        }.bind(navigator);
      }
    }
  },
  shimRTCIceServerUrls: function(window) {
    // migrate from non-spec RTCIceServer.url to RTCIceServer.urls
    var OrigPeerConnection = window.RTCPeerConnection;
    window.RTCPeerConnection = function(pcConfig, pcConstraints) {
      if (pcConfig && pcConfig.iceServers) {
        var newIceServers = [];
        for (var i = 0; i < pcConfig.iceServers.length; i++) {
          var server = pcConfig.iceServers[i];
          if (!server.hasOwnProperty('urls') &&
              server.hasOwnProperty('url')) {
            utils.deprecated('RTCIceServer.url', 'RTCIceServer.urls');
            server = JSON.parse(JSON.stringify(server));
            server.urls = server.url;
            delete server.url;
            newIceServers.push(server);
          } else {
            newIceServers.push(pcConfig.iceServers[i]);
          }
        }
        pcConfig.iceServers = newIceServers;
      }
      return new OrigPeerConnection(pcConfig, pcConstraints);
    };
    window.RTCPeerConnection.prototype = OrigPeerConnection.prototype;
    // wrap static methods. Currently just generateCertificate.
    if ('generateCertificate' in window.RTCPeerConnection) {
      Object.defineProperty(window.RTCPeerConnection, 'generateCertificate', {
        get: function() {
          return OrigPeerConnection.generateCertificate;
        }
      });
    }
  },
  shimTrackEventTransceiver: function(window) {
    // Add event.transceiver member over deprecated event.receiver
    if (typeof window === 'object' && window.RTCPeerConnection &&
        ('receiver' in window.RTCTrackEvent.prototype) &&
        // can't check 'transceiver' in window.RTCTrackEvent.prototype, as it is
        // defined for some reason even when window.RTCTransceiver is not.
        !window.RTCTransceiver) {
      Object.defineProperty(window.RTCTrackEvent.prototype, 'transceiver', {
        get: function() {
          return {receiver: this.receiver};
        }
      });
    }
  },

  shimCreateOfferLegacy: function(window) {
    var origCreateOffer = window.RTCPeerConnection.prototype.createOffer;
    window.RTCPeerConnection.prototype.createOffer = function(offerOptions) {
      var pc = this;
      if (offerOptions) {
        if (typeof offerOptions.offerToReceiveAudio !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveAudio = !!offerOptions.offerToReceiveAudio;
        }
        var audioTransceiver = pc.getTransceivers().find(function(transceiver) {
          return transceiver.sender.track &&
              transceiver.sender.track.kind === 'audio';
        });
        if (offerOptions.offerToReceiveAudio === false && audioTransceiver) {
          if (audioTransceiver.direction === 'sendrecv') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('sendonly');
            } else {
              audioTransceiver.direction = 'sendonly';
            }
          } else if (audioTransceiver.direction === 'recvonly') {
            if (audioTransceiver.setDirection) {
              audioTransceiver.setDirection('inactive');
            } else {
              audioTransceiver.direction = 'inactive';
            }
          }
        } else if (offerOptions.offerToReceiveAudio === true &&
            !audioTransceiver) {
          pc.addTransceiver('audio');
        }


        if (typeof offerOptions.offerToReceiveVideo !== 'undefined') {
          // support bit values
          offerOptions.offerToReceiveVideo = !!offerOptions.offerToReceiveVideo;
        }
        var videoTransceiver = pc.getTransceivers().find(function(transceiver) {
          return transceiver.sender.track &&
              transceiver.sender.track.kind === 'video';
        });
        if (offerOptions.offerToReceiveVideo === false && videoTransceiver) {
          if (videoTransceiver.direction === 'sendrecv') {
            videoTransceiver.setDirection('sendonly');
          } else if (videoTransceiver.direction === 'recvonly') {
            videoTransceiver.setDirection('inactive');
          }
        } else if (offerOptions.offerToReceiveVideo === true &&
            !videoTransceiver) {
          pc.addTransceiver('video');
        }
      }
      return origCreateOffer.apply(pc, arguments);
    };
  }
};


/***/ }),

/***/ "./node_modules/webrtc-adapter/src/js/utils.js":
/*!*****************************************************!*\
  !*** ./node_modules/webrtc-adapter/src/js/utils.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
 /* eslint-env node */


var logDisabled_ = true;
var deprecationWarnings_ = true;

/**
 * Extract browser version out of the provided user agent string.
 *
 * @param {!string} uastring userAgent string.
 * @param {!string} expr Regular expression used as match criteria.
 * @param {!number} pos position in the version string to be returned.
 * @return {!number} browser version.
 */
function extractVersion(uastring, expr, pos) {
  var match = uastring.match(expr);
  return match && match.length >= pos && parseInt(match[pos], 10);
}

// Wraps the peerconnection event eventNameToWrap in a function
// which returns the modified event object (or false to prevent
// the event).
function wrapPeerConnectionEvent(window, eventNameToWrap, wrapper) {
  if (!window.RTCPeerConnection) {
    return;
  }
  var proto = window.RTCPeerConnection.prototype;
  var nativeAddEventListener = proto.addEventListener;
  proto.addEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap) {
      return nativeAddEventListener.apply(this, arguments);
    }
    var wrappedCallback = function(e) {
      var modifiedEvent = wrapper(e);
      if (modifiedEvent) {
        cb(modifiedEvent);
      }
    };
    this._eventMap = this._eventMap || {};
    this._eventMap[cb] = wrappedCallback;
    return nativeAddEventListener.apply(this, [nativeEventName,
      wrappedCallback]);
  };

  var nativeRemoveEventListener = proto.removeEventListener;
  proto.removeEventListener = function(nativeEventName, cb) {
    if (nativeEventName !== eventNameToWrap || !this._eventMap
        || !this._eventMap[cb]) {
      return nativeRemoveEventListener.apply(this, arguments);
    }
    var unwrappedCb = this._eventMap[cb];
    delete this._eventMap[cb];
    return nativeRemoveEventListener.apply(this, [nativeEventName,
      unwrappedCb]);
  };

  Object.defineProperty(proto, 'on' + eventNameToWrap, {
    get: function() {
      return this['_on' + eventNameToWrap];
    },
    set: function(cb) {
      if (this['_on' + eventNameToWrap]) {
        this.removeEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap]);
        delete this['_on' + eventNameToWrap];
      }
      if (cb) {
        this.addEventListener(eventNameToWrap,
            this['_on' + eventNameToWrap] = cb);
      }
    },
    enumerable: true,
    configurable: true
  });
}

// Utility methods.
module.exports = {
  extractVersion: extractVersion,
  wrapPeerConnectionEvent: wrapPeerConnectionEvent,
  disableLog: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    logDisabled_ = bool;
    return (bool) ? 'adapter.js logging disabled' :
        'adapter.js logging enabled';
  },

  /**
   * Disable or enable deprecation warnings
   * @param {!boolean} bool set to true to disable warnings.
   */
  disableWarnings: function(bool) {
    if (typeof bool !== 'boolean') {
      return new Error('Argument type: ' + typeof bool +
          '. Please use a boolean.');
    }
    deprecationWarnings_ = !bool;
    return 'adapter.js deprecation warnings ' + (bool ? 'disabled' : 'enabled');
  },

  log: function() {
    if (typeof window === 'object') {
      if (logDisabled_) {
        return;
      }
      if (typeof console !== 'undefined' && typeof console.log === 'function') {
        console.log.apply(console, arguments);
      }
    }
  },

  /**
   * Shows a deprecation warning suggesting the modern and spec-compatible API.
   */
  deprecated: function(oldMethod, newMethod) {
    if (!deprecationWarnings_) {
      return;
    }
    console.warn(oldMethod + ' is deprecated, please use ' + newMethod +
        ' instead.');
  },

  /**
   * Browser detector.
   *
   * @return {object} result containing browser and version
   *     properties.
   */
  detectBrowser: function(window) {
    var navigator = window && window.navigator;

    // Returned result object.
    var result = {};
    result.browser = null;
    result.version = null;

    // Fail early if it's not a browser
    if (typeof window === 'undefined' || !window.navigator) {
      result.browser = 'Not a browser.';
      return result;
    }

    if (navigator.mozGetUserMedia) { // Firefox.
      result.browser = 'firefox';
      result.version = extractVersion(navigator.userAgent,
          /Firefox\/(\d+)\./, 1);
    } else if (navigator.webkitGetUserMedia) {
      // Chrome, Chromium, Webview, Opera.
      // Version matches Chrome/WebRTC version.
      result.browser = 'chrome';
      result.version = extractVersion(navigator.userAgent,
          /Chrom(e|ium)\/(\d+)\./, 2);
    } else if (navigator.mediaDevices &&
        navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) { // Edge.
      result.browser = 'edge';
      result.version = extractVersion(navigator.userAgent,
          /Edge\/(\d+).(\d+)$/, 2);
    } else if (window.RTCPeerConnection &&
        navigator.userAgent.match(/AppleWebKit\/(\d+)\./)) { // Safari.
      result.browser = 'safari';
      result.version = extractVersion(navigator.userAgent,
          /AppleWebKit\/(\d+)\./, 1);
    } else { // Default fallthrough: not supported.
      result.browser = 'Not a supported browser.';
      return result;
    }

    return result;
  }
};


/***/ }),

/***/ "./src/awrtc/index.ts":
/*!****************************!*\
  !*** ./src/awrtc/index.ts ***!
  \****************************/
/*! exports provided: NetEventType, NetEventDataType, NetworkEvent, ConnectionId, Queue, List, Output, Debug, Encoder, UTF16Encoding, Encoding, Random, Helper, SLogLevel, SLog, SignalingConfig, SignalingInfo, WebRtcPeerState, WebRtcInternalState, AWebRtcPeer, WebRtcDataPeer, WebRtcNetworkServerState, WebRtcNetwork, WebsocketConnectionStatus, WebsocketServerStatus, WebsocketNetwork, LocalNetwork, AWebRtcCall, CallEventType, CallEventArgs, CallAcceptedEventArgs, CallEndedEventArgs, CallErrorType, ErrorEventArgs, WaitForIncomingCallEventArgs, MessageEventArgs, DataMessageEventArgs, MediaUpdatedEventArgs, FrameUpdateEventArgs, MediaConfigurationState, MediaEventType, MediaEvent, MediaConfig, NetworkConfig, FramePixelFormat, IFrameData, RawFrame, LazyFrame, BrowserMediaNetwork, BrowserWebRtcCall, BrowserMediaStream, MediaPeer, DeviceInfo, DeviceApi, CAPI_InitAsync, CAPI_PollInitState, CAPI_SLog_SetLogLevel, CAPI_WebRtcNetwork_IsAvailable, CAPI_WebRtcNetwork_IsBrowserSupported, CAPI_WebRtcNetwork_Create, CAPI_WebRtcNetwork_Release, CAPI_WebRtcNetwork_Connect, CAPI_WebRtcNetwork_StartServer, CAPI_WebRtcNetwork_StopServer, CAPI_WebRtcNetwork_Disconnect, CAPI_WebRtcNetwork_Shutdown, CAPI_WebRtcNetwork_Update, CAPI_WebRtcNetwork_Flush, CAPI_WebRtcNetwork_SendData, CAPI_WebRtcNetwork_SendDataEm, CAPI_WebRtcNetwork_GetBufferedAmount, CAPI_WebRtcNetwork_Dequeue, CAPI_WebRtcNetwork_Peek, CAPI_WebRtcNetwork_PeekEventDataLength, CAPI_WebRtcNetwork_CheckEventLength, CAPI_WebRtcNetwork_EventDataToUint8Array, CAPI_WebRtcNetwork_DequeueEm, CAPI_WebRtcNetwork_PeekEm, CAPI_MediaNetwork_IsAvailable, CAPI_MediaNetwork_HasUserMedia, CAPI_MediaNetwork_Create, CAPI_MediaNetwork_Configure, CAPI_MediaNetwork_GetConfigurationState, CAPI_MediaNetwork_GetConfigurationError, CAPI_MediaNetwork_ResetConfiguration, CAPI_MediaNetwork_TryGetFrame, CAPI_MediaNetwork_TryGetFrameDataLength, CAPI_MediaNetwork_SetVolume, CAPI_MediaNetwork_HasAudioTrack, CAPI_MediaNetwork_HasVideoTrack, CAPI_MediaNetwork_SetMute, CAPI_MediaNetwork_IsMute, CAPI_DeviceApi_Update, CAPI_DeviceApi_RequestUpdate, CAPI_DeviceApi_LastUpdate, CAPI_DeviceApi_Devices_Length, CAPI_DeviceApi_Devices_Get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./network/index */ "./src/awrtc/network/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventType", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventDataType", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventDataType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkEvent", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConnectionId", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Queue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "List", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["List"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Output"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Debug", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Debug"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Encoder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UTF16Encoding", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["UTF16Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoding", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Random"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["Helper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLogLevel", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLog", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingConfig", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingInfo", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcPeerState", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcInternalState", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcInternalState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcPeer", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["AWebRtcPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcDataPeer", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcDataPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkServerState", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetworkServerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetwork", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketConnectionStatus", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketServerStatus", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketServerStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketNetwork", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalNetwork", function() { return _network_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"]; });

/* harmony import */ var _media_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./media/index */ "./src/awrtc/media/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcCall", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["AWebRtcCall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEventType", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["CallEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["CallEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallAcceptedEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEndedEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["CallEndedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallErrorType", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ErrorEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WaitForIncomingCallEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["WaitForIncomingCallEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MessageEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["MessageEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataMessageEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["DataMessageEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaUpdatedEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaUpdatedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FrameUpdateEventArgs", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["FrameUpdateEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaConfigurationState", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaEventType", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaEvent", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaConfig", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkConfig", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["NetworkConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FramePixelFormat", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["FramePixelFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IFrameData", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["IFrameData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RawFrame", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["RawFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LazyFrame", function() { return _media_index__WEBPACK_IMPORTED_MODULE_1__["LazyFrame"]; });

/* harmony import */ var _media_browser_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./media_browser/index */ "./src/awrtc/media_browser/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaNetwork", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaNetwork"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserWebRtcCall", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserWebRtcCall"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaStream", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaStream"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaPeer", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["MediaPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceInfo", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceApi", function() { return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"]; });

/* harmony import */ var _unity_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./unity/index */ "./src/awrtc/unity/index.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_InitAsync", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_InitAsync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_PollInitState", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_PollInitState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_SLog_SetLogLevel", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_SLog_SetLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsAvailable", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsBrowserSupported", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_IsBrowserSupported"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Create", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Release", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Release"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Connect", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Connect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StartServer", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_StartServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StopServer", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_StopServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Disconnect", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Disconnect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Shutdown", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Shutdown"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Update", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Flush", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Flush"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendData", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_SendData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendDataEm", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_SendDataEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_GetBufferedAmount", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_GetBufferedAmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Dequeue", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Dequeue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Peek", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_Peek"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEventDataLength", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_PeekEventDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_CheckEventLength", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_CheckEventLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_EventDataToUint8Array", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_EventDataToUint8Array"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_DequeueEm", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_DequeueEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEm", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_WebRtcNetwork_PeekEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsAvailable", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasUserMedia", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_HasUserMedia"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Create", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Configure", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_Configure"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationState", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_GetConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationError", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_GetConfigurationError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_ResetConfiguration", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_ResetConfiguration"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_TryGetFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrameDataLength", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_TryGetFrameDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetVolume", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_SetVolume"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasAudioTrack", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_HasAudioTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasVideoTrack", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_HasVideoTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetMute", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_SetMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsMute", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_MediaNetwork_IsMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Update", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_RequestUpdate", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_RequestUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_LastUpdate", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_LastUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Devices_Length", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_Devices_Length"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Devices_Get", function() { return _unity_index__WEBPACK_IMPORTED_MODULE_3__["CAPI_DeviceApi_Devices_Get"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
console.debug("loading awrtc modules ...");
var adapter = __webpack_require__(/*! webrtc-adapter */ "./node_modules/webrtc-adapter/src/js/adapter_core.js");


//for simplicity browser and unity are merged here
//it could as well be built and deployed separately


console.debug("loading awrtc modules completed");


/***/ }),

/***/ "./src/awrtc/media/AWebRtcCall.ts":
/*!****************************************!*\
  !*** ./src/awrtc/media/AWebRtcCall.ts ***!
  \****************************************/
/*! exports provided: AWebRtcCall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AWebRtcCall", function() { return AWebRtcCall; });
/* harmony import */ var _IMediaNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IMediaNetwork */ "./src/awrtc/media/IMediaNetwork.ts");
/* harmony import */ var _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CallEventArgs */ "./src/awrtc/media/CallEventArgs.ts");
/* harmony import */ var _network_Helper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../network/Helper */ "./src/awrtc/network/Helper.ts");
/* harmony import */ var _NetworkConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NetworkConfig */ "./src/awrtc/media/NetworkConfig.ts");
/* harmony import */ var _MediaConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MediaConfig */ "./src/awrtc/media/MediaConfig.ts");
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();






var CallException = /** @class */ (function () {
    function CallException(errorMsg) {
        this.mErrorMsg = errorMsg;
    }
    CallException.prototype.ErrorMsg = function () {
    };
    return CallException;
}());
var InvalidOperationException = /** @class */ (function (_super) {
    __extends(InvalidOperationException, _super);
    function InvalidOperationException() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InvalidOperationException;
}(CallException));
/// <summary>
/// State of the call. Mainly used to check for bugs / invalid states.
/// </summary>
var CallState;
(function (CallState) {
    /// <summary>
    /// Not yet initialized / bug
    /// </summary>
    CallState[CallState["Invalid"] = 0] = "Invalid";
    /// <summary>
    /// Object is initialized but local media not yet configured
    /// </summary>
    CallState[CallState["Initialized"] = 1] = "Initialized";
    /// <summary>
    /// In process of accessing the local media devices.
    /// </summary>
    CallState[CallState["Configuring"] = 2] = "Configuring";
    /// <summary>
    /// Configured. Video/Audio can be accessed and call is ready to start
    /// </summary>
    CallState[CallState["Configured"] = 3] = "Configured";
    /// <summary>
    /// In process of requesting an address from the server to then listen and wait for
    /// an incoming call.
    /// </summary>
    CallState[CallState["RequestingAddress"] = 4] = "RequestingAddress";
    /// <summary>
    /// Call is listening on an address and waiting for an incoming call
    /// </summary>
    CallState[CallState["WaitingForIncomingCall"] = 5] = "WaitingForIncomingCall";
    /// <summary>
    /// Call is in the process of connecting to another call object.
    /// </summary>
    CallState[CallState["WaitingForOutgoingCall"] = 6] = "WaitingForOutgoingCall";
    /// <summary>
    /// Indicating that the call object is at least connected to another object
    /// </summary>
    CallState[CallState["InCall"] = 7] = "InCall";
    //CallAcceptedIncoming,
    //CallAcceptedOutgoing,
    /// <summary>
    /// Call ended / conference room closed
    /// </summary>
    CallState[CallState["Closed"] = 8] = "Closed";
})(CallState || (CallState = {}));
/*
class ConnectionMetaData
{
}
*/
var ConnectionInfo = /** @class */ (function () {
    function ConnectionInfo() {
        this.mConnectionIds = new Array();
        //public GetMeta(id:ConnectionId) : ConnectionMetaData
        //{
        //    return this.mConnectionMeta[id.id];
        //}
    }
    //private mConnectionMeta: { [id: number]: ConnectionMetaData } = {};
    ConnectionInfo.prototype.AddConnection = function (id, incoming) {
        this.mConnectionIds.push(id.id);
        //this.mConnectionMeta[id.id] = new ConnectionMetaData();
    };
    ConnectionInfo.prototype.RemConnection = function (id) {
        var index = this.mConnectionIds.indexOf(id.id);
        if (index >= 0) {
            this.mConnectionIds.splice(index, 1);
        }
        else {
            _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LE("tried to remove an unknown connection with id " + id.id);
        }
        //delete this.mConnectionMeta[id.id];
    };
    ConnectionInfo.prototype.HasConnection = function (id) {
        return this.mConnectionIds.indexOf(id.id) != -1;
    };
    ConnectionInfo.prototype.GetIds = function () {
        return this.mConnectionIds;
    };
    return ConnectionInfo;
}());
/**This class wraps an implementation of
 * IMediaStream and converts its polling system
 * to an easier to use event based system.
 *
 * Ideally use only features defined by
 * ICall to avoid having to deal with internal changes
 * in future updates.
 */
var AWebRtcCall = /** @class */ (function () {
    function AWebRtcCall(config) {
        if (config === void 0) { config = null; }
        this.MESSAGE_TYPE_INVALID = 0;
        this.MESSAGE_TYPE_DATA = 1;
        this.MESSAGE_TYPE_STRING = 2;
        this.MESSAGE_TYPE_CONTROL = 3;
        this.mNetworkConfig = new _NetworkConfig__WEBPACK_IMPORTED_MODULE_3__["NetworkConfig"]();
        this.mMediaConfig = null;
        this.mCallEventHandlers = [];
        this.mNetwork = null;
        this.mConnectionInfo = new ConnectionInfo();
        this.mConferenceMode = false;
        this.mState = CallState.Invalid;
        this.mIsDisposed = false;
        this.mServerInactive = true;
        this.mPendingListenCall = false;
        this.mPendingCallCall = false;
        this.mPendingAddress = null;
        if (config != null) {
            this.mNetworkConfig = config;
            this.mConferenceMode = config.IsConference;
        }
    }
    AWebRtcCall.prototype.addEventListener = function (listener) {
        this.mCallEventHandlers.push(listener);
    };
    AWebRtcCall.prototype.removeEventListener = function (listener) {
        this.mCallEventHandlers = this.mCallEventHandlers.filter(function (h) { return h !== listener; });
    };
    Object.defineProperty(AWebRtcCall.prototype, "State", {
        get: function () {
            return this.mState;
        },
        enumerable: true,
        configurable: true
    });
    AWebRtcCall.prototype.Initialize = function (network) {
        this.mNetwork = network;
        this.mState = CallState.Initialized;
    };
    AWebRtcCall.prototype.Configure = function (config) {
        this.CheckDisposed();
        if (this.mState != CallState.Initialized) {
            throw new InvalidOperationException("Method can't be used in state " + this.mState);
        }
        this.mState = CallState.Configuring;
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Enter state CallState.Configuring");
        this.mMediaConfig = config;
        this.mNetwork.Configure(this.mMediaConfig);
    };
    AWebRtcCall.prototype.Call = function (address) {
        this.CheckDisposed();
        if (this.mState != CallState.Initialized
            && this.mState != CallState.Configuring
            && this.mState != CallState.Configured) {
            throw new InvalidOperationException("Method can't be used in state " + this.mState);
        }
        if (this.mConferenceMode) {
            throw new InvalidOperationException("Method can't be used in conference calls.");
        }
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Call to " + address);
        this.EnsureConfiguration();
        if (this.mState == CallState.Configured) {
            this.ProcessCall(address);
        }
        else {
            this.PendingCall(address);
        }
    };
    AWebRtcCall.prototype.Listen = function (address) {
        this.CheckDisposed();
        if (this.mState != CallState.Initialized
            && this.mState != CallState.Configuring
            && this.mState != CallState.Configured) {
            throw new InvalidOperationException("Method can't be used in state " + this.mState);
        }
        this.EnsureConfiguration();
        if (this.mState == CallState.Configured) {
            this.ProcessListen(address);
        }
        else {
            this.PendingListen(address);
        }
    };
    AWebRtcCall.prototype.Send = function (message, reliable, id) {
        this.CheckDisposed();
        if (reliable == null)
            reliable = true;
        if (id) {
            this.InternalSendTo(message, reliable, id);
        }
        else {
            this.InternalSendToAll(message, reliable);
        }
    };
    AWebRtcCall.prototype.InternalSendToAll = function (message, reliable) {
        var data = this.PackStringMsg(message);
        ;
        for (var _i = 0, _a = this.mConnectionInfo.GetIds(); _i < _a.length; _i++) {
            var id = _a[_i];
            _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].L("Send message to " + id + "! " + message);
            this.InternalSendRawTo(data, new _network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"](id), reliable);
        }
    };
    AWebRtcCall.prototype.InternalSendTo = function (message, reliable, id) {
        var data = this.PackStringMsg(message);
        this.InternalSendRawTo(data, id, reliable);
    };
    AWebRtcCall.prototype.SendData = function (message, reliable, id) {
        this.CheckDisposed();
        var data = this.PackDataMsg(message);
        this.InternalSendRawTo(data, id, reliable);
    };
    AWebRtcCall.prototype.PackStringMsg = function (message) {
        var data = _network_Helper__WEBPACK_IMPORTED_MODULE_2__["Encoding"].UTF16.GetBytes(message);
        var buff = new Uint8Array(data.length + 1);
        buff[0] = this.MESSAGE_TYPE_STRING;
        for (var i = 0; i < data.length; i++) {
            buff[i + 1] = data[i];
        }
        return buff;
    };
    AWebRtcCall.prototype.UnpackStringMsg = function (message) {
        var buff = new Uint8Array(message.length - 1);
        for (var i = 0; i < buff.length; i++) {
            buff[i] = message[i + 1];
        }
        var res = _network_Helper__WEBPACK_IMPORTED_MODULE_2__["Encoding"].UTF16.GetString(buff);
        return res;
    };
    AWebRtcCall.prototype.PackDataMsg = function (data) {
        var buff = new Uint8Array(data.length + 1);
        buff[0] = this.MESSAGE_TYPE_DATA;
        for (var i = 0; i < data.length; i++) {
            buff[i + 1] = data[i];
        }
        return buff;
    };
    AWebRtcCall.prototype.UnpackDataMsg = function (message) {
        var buff = new Uint8Array(message.length - 1);
        for (var i = 0; i < buff.length; i++) {
            buff[i] = message[i + 1];
        }
        return buff;
    };
    AWebRtcCall.prototype.InternalSendRawTo = function (rawdata, id, reliable) {
        this.mNetwork.SendData(id, rawdata, reliable);
    };
    AWebRtcCall.prototype.Update = function () {
        if (this.mIsDisposed)
            return;
        if (this.mNetwork == null)
            return;
        this.mNetwork.Update();
        //waiting for the media configuration?
        if (this.mState == CallState.Configuring) {
            var configState = this.mNetwork.GetConfigurationState();
            if (configState == _IMediaNetwork__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Failed) {
                this.OnConfigurationFailed(this.mNetwork.GetConfigurationError());
                //bugfix: user might dispose the call during the event above
                if (this.mIsDisposed)
                    return;
                if (this.mNetwork != null)
                    this.mNetwork.ResetConfiguration();
            }
            else if (configState == _IMediaNetwork__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Successful) {
                this.OnConfigurationComplete();
                if (this.mIsDisposed)
                    return;
            }
        }
        var evt;
        while ((evt = this.mNetwork.Dequeue()) != null) {
            switch (evt.Type) {
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].NewConnection:
                    if (this.mState == CallState.WaitingForIncomingCall
                        || (this.mConferenceMode && this.mState == CallState.InCall)) //keep accepting connections after 
                     {
                        //remove ability to accept incoming connections
                        if (this.mConferenceMode == false)
                            this.mNetwork.StopServer();
                        this.mState = CallState.InCall;
                        this.mConnectionInfo.AddConnection(evt.ConnectionId, true);
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"](evt.ConnectionId));
                        if (this.mIsDisposed)
                            return;
                    }
                    else if (this.mState == CallState.WaitingForOutgoingCall) {
                        this.mConnectionInfo.AddConnection(evt.ConnectionId, false);
                        //only possible in 1 on 1 calls
                        this.mState = CallState.InCall;
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"](evt.ConnectionId));
                        if (this.mIsDisposed)
                            return;
                    }
                    else {
                        //Debug.Assert(mState == CallState.WaitingForIncomingCall || mState == CallState.WaitingForOutgoingCall);
                        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LogWarning("Received incoming connection during invalid state " + this.mState);
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ConnectionFailed:
                    //call failed
                    if (this.mState == CallState.WaitingForOutgoingCall) {
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ConnectionFailed));
                        if (this.mIsDisposed)
                            return;
                        this.mState = CallState.Configured;
                    }
                    else {
                        //Debug.Assert(mState == CallState.WaitingForOutgoingCall);
                        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LogError("Received ConnectionFailed during " + this.mState);
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].Disconnected:
                    if (this.mConnectionInfo.HasConnection(evt.ConnectionId)) {
                        this.mConnectionInfo.RemConnection(evt.ConnectionId);
                        //call ended
                        if (this.mConferenceMode == false && this.mConnectionInfo.GetIds().length == 0) {
                            this.mState = CallState.Closed;
                        }
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEndedEventArgs"](evt.ConnectionId));
                        if (this.mIsDisposed)
                            return;
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ServerInitialized:
                    //incoming calls possible
                    this.mServerInactive = false;
                    this.mState = CallState.WaitingForIncomingCall;
                    this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["WaitForIncomingCallEventArgs"](evt.Info));
                    if (this.mIsDisposed)
                        return;
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ServerInitFailed:
                    this.mServerInactive = true;
                    //reset state to the earlier state which is Configured (as without configuration no
                    //listening possible). Local camera/audio will keep running
                    this.mState = CallState.Configured;
                    this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ListeningFailed));
                    if (this.mIsDisposed)
                        return;
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ServerClosed:
                    this.mServerInactive = true;
                    //no incoming calls possible anymore
                    if (this.mState == CallState.WaitingForIncomingCall || this.mState == CallState.RequestingAddress) {
                        this.mState = CallState.Configured;
                        //might need to be handled as a special timeout event?
                        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ListeningFailed, _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"].Unknown, "Server closed the connection while waiting for incoming calls."));
                        if (this.mIsDisposed)
                            return;
                    }
                    else {
                        //event is normal during other states as the server connection will be closed after receiving a call
                    }
                    break;
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ReliableMessageReceived:
                case _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].UnreliableMessageReceived:
                    var reliable = evt.Type === _network_index__WEBPACK_IMPORTED_MODULE_5__["NetEventType"].ReliableMessageReceived;
                    //chat message received
                    if (evt.MessageData.length >= 2) {
                        if (evt.MessageData[0] == this.MESSAGE_TYPE_STRING) {
                            var message = this.UnpackStringMsg(evt.MessageData);
                            this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MessageEventArgs"](evt.ConnectionId, message, reliable));
                        }
                        else if (evt.MessageData[0] == this.MESSAGE_TYPE_DATA) {
                            var message = this.UnpackDataMsg(evt.MessageData);
                            this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["DataMessageEventArgs"](evt.ConnectionId, message, reliable));
                        }
                        else {
                            //invalid message?
                        }
                    }
                    else {
                        //invalid message?
                    }
                    if (this.mIsDisposed)
                        return;
                    break;
            }
        }
        var handleLocalFrames = true;
        var handleRemoteFrames = true;
        if (this.mMediaConfig.FrameUpdates && handleLocalFrames) {
            var localFrame = this.mNetwork.TryGetFrame(_network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"].INVALID);
            if (localFrame != null) {
                this.FrameToCallEvent(_network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"].INVALID, localFrame);
                if (this.mIsDisposed)
                    return;
            }
        }
        if (this.mMediaConfig.FrameUpdates && handleRemoteFrames) {
            for (var _i = 0, _a = this.mConnectionInfo.GetIds(); _i < _a.length; _i++) {
                var id = _a[_i];
                var conId = new _network_index__WEBPACK_IMPORTED_MODULE_5__["ConnectionId"](id);
                var remoteFrame = this.mNetwork.TryGetFrame(conId);
                if (remoteFrame != null) {
                    this.FrameToCallEvent(conId, remoteFrame);
                    if (this.mIsDisposed)
                        return;
                }
            }
        }
        var mediaEvent = null;
        while ((mediaEvent = this.mNetwork.DequeueMediaEvent()) != null) {
            this.MediaEventToCallEvent(mediaEvent);
        }
        this.mNetwork.Flush();
    };
    AWebRtcCall.prototype.FrameToCallEvent = function (id, frame) {
        var args = new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["FrameUpdateEventArgs"](id, frame);
        this.TriggerCallEvent(args);
    };
    AWebRtcCall.prototype.MediaEventToCallEvent = function (evt) {
        var videoElement = null;
        if (evt.EventType == evt.EventType) {
            var args = new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MediaUpdatedEventArgs"](evt.ConnectionId, evt.Args);
            this.TriggerCallEvent(args);
        }
    };
    AWebRtcCall.prototype.PendingCall = function (address) {
        this.mPendingAddress = address;
        this.mPendingCallCall = true;
        this.mPendingListenCall = false;
    };
    AWebRtcCall.prototype.ProcessCall = function (address) {
        this.mState = CallState.WaitingForOutgoingCall;
        this.mNetwork.Connect(address);
        this.ClearPending();
    };
    AWebRtcCall.prototype.PendingListen = function (address) {
        this.mPendingAddress = address;
        this.mPendingCallCall = false;
        this.mPendingListenCall = true;
    };
    AWebRtcCall.prototype.ProcessListen = function (address) {
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Listen at " + address);
        this.mServerInactive = false;
        this.mState = CallState.RequestingAddress;
        this.mNetwork.StartServer(address);
        this.ClearPending();
    };
    AWebRtcCall.prototype.DoPending = function () {
        if (this.mPendingCallCall) {
            this.ProcessCall(this.mPendingAddress);
        }
        else if (this.mPendingListenCall) {
            this.ProcessListen(this.mPendingAddress);
        }
        this.ClearPending();
    };
    AWebRtcCall.prototype.ClearPending = function () {
        this.mPendingAddress = null;
        this.mPendingCallCall = null;
        this.mPendingListenCall = null;
    };
    AWebRtcCall.prototype.CheckDisposed = function () {
        if (this.mIsDisposed)
            throw new InvalidOperationException("Object is disposed. No method calls possible.");
    };
    AWebRtcCall.prototype.EnsureConfiguration = function () {
        if (this.mState == CallState.Initialized) {
            _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Use default configuration");
            this.Configure(new _MediaConfig__WEBPACK_IMPORTED_MODULE_4__["MediaConfig"]());
        }
        else {
        }
    };
    AWebRtcCall.prototype.TriggerCallEvent = function (args) {
        var arr = this.mCallEventHandlers.slice();
        for (var _i = 0, arr_1 = arr; _i < arr_1.length; _i++) {
            var callback = arr_1[_i];
            callback(this, args);
        }
    };
    AWebRtcCall.prototype.OnConfigurationComplete = function () {
        if (this.mIsDisposed)
            return;
        this.mState = CallState.Configured;
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].Log("Enter state CallState.Configured");
        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ConfigurationComplete));
        if (this.mIsDisposed == false)
            this.DoPending();
    };
    AWebRtcCall.prototype.OnConfigurationFailed = function (error) {
        _network_Helper__WEBPACK_IMPORTED_MODULE_2__["SLog"].LogWarning("Configuration failed: " + error);
        if (this.mIsDisposed)
            return;
        this.mState = CallState.Initialized;
        this.TriggerCallEvent(new _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"](_CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"].ConfigurationFailed, _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"].Unknown, error));
        //bugfix: user might dispose the call during the event above
        if (this.mIsDisposed == false)
            this.ClearPending();
    };
    AWebRtcCall.prototype.DisposeInternal = function (disposing) {
        //nothing to dispose but subclasses overwrite this
        if (!this.mIsDisposed) {
            if (disposing) {
            }
            this.mIsDisposed = true;
        }
    };
    AWebRtcCall.prototype.Dispose = function () {
        this.DisposeInternal(true);
    };
    return AWebRtcCall;
}());



/***/ }),

/***/ "./src/awrtc/media/CallEventArgs.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media/CallEventArgs.ts ***!
  \******************************************/
/*! exports provided: CallEventType, CallEventArgs, CallAcceptedEventArgs, CallEndedEventArgs, CallErrorType, ErrorEventArgs, WaitForIncomingCallEventArgs, MessageEventArgs, DataMessageEventArgs, MediaUpdatedEventArgs, FrameUpdateEventArgs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallEventType", function() { return CallEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallEventArgs", function() { return CallEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallAcceptedEventArgs", function() { return CallAcceptedEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallEndedEventArgs", function() { return CallEndedEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallErrorType", function() { return CallErrorType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ErrorEventArgs", function() { return ErrorEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WaitForIncomingCallEventArgs", function() { return WaitForIncomingCallEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageEventArgs", function() { return MessageEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DataMessageEventArgs", function() { return DataMessageEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaUpdatedEventArgs", function() { return MediaUpdatedEventArgs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FrameUpdateEventArgs", function() { return FrameUpdateEventArgs; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/// <summary>
/// Type of the event.
/// </summary>
var CallEventType;
(function (CallEventType) {
    /// <summary>
    /// Used if the event value wasn't initialized
    /// </summary>
    CallEventType[CallEventType["Invalid"] = 0] = "Invalid";
    /// <summary>
    /// The call object is successfully connected to the server waiting for another user 
    /// to connect.
    /// </summary>
    CallEventType[CallEventType["WaitForIncomingCall"] = 1] = "WaitForIncomingCall";
    /// <summary>
    /// A call was accepted
    /// </summary>
    CallEventType[CallEventType["CallAccepted"] = 2] = "CallAccepted";
    /// <summary>
    /// The call ended
    /// </summary>
    CallEventType[CallEventType["CallEnded"] = 3] = "CallEnded";
    /**
     * Backwards compatibility. Use MediaUpdate
     */
    CallEventType[CallEventType["FrameUpdate"] = 4] = "FrameUpdate";
    /// <summary>
    /// Text message arrived
    /// </summary>
    CallEventType[CallEventType["Message"] = 5] = "Message";
    /// <summary>
    /// Connection failed. Might be due to an server, network error or the address didn't exist
    /// Using ErrorEventArgs
    /// </summary>
    CallEventType[CallEventType["ConnectionFailed"] = 6] = "ConnectionFailed";
    /// <summary>
    /// Listening failed. Address might be in use or due to server/network error
    /// Using ErrorEventArgs
    /// </summary>
    CallEventType[CallEventType["ListeningFailed"] = 7] = "ListeningFailed";
    /// <summary>
    /// Event triggered after the local media was successfully configured. 
    /// If requested the call object will have access to the users camera and/or audio now and
    /// the local camera frames can be received in events. 
    /// </summary>
    CallEventType[CallEventType["ConfigurationComplete"] = 8] = "ConfigurationComplete";
    /// <summary>
    /// Configuration failed. This happens if the configuration requested features
    /// the system doesn't support e.g. no camera, camera doesn't support the requested resolution
    /// or the user didn't allow the website to access the camera/microphone in WebGL mode.
    /// </summary>
    CallEventType[CallEventType["ConfigurationFailed"] = 9] = "ConfigurationFailed";
    /// <summary>
    /// Reliable or unreliable data msg arrived
    /// </summary>
    CallEventType[CallEventType["DataMessage"] = 10] = "DataMessage";
    /**
     *
     */
    CallEventType[CallEventType["MediaUpdate"] = 20] = "MediaUpdate";
})(CallEventType || (CallEventType = {}));
var CallEventArgs = /** @class */ (function () {
    function CallEventArgs(type) {
        this.mType = CallEventType.Invalid;
        this.mType = type;
    }
    Object.defineProperty(CallEventArgs.prototype, "Type", {
        get: function () {
            return this.mType;
        },
        enumerable: true,
        configurable: true
    });
    return CallEventArgs;
}());

var CallAcceptedEventArgs = /** @class */ (function (_super) {
    __extends(CallAcceptedEventArgs, _super);
    function CallAcceptedEventArgs(connectionId) {
        var _this = _super.call(this, CallEventType.CallAccepted) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = connectionId;
        return _this;
    }
    Object.defineProperty(CallAcceptedEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    return CallAcceptedEventArgs;
}(CallEventArgs));

var CallEndedEventArgs = /** @class */ (function (_super) {
    __extends(CallEndedEventArgs, _super);
    function CallEndedEventArgs(connectionId) {
        var _this = _super.call(this, CallEventType.CallEnded) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = connectionId;
        return _this;
    }
    Object.defineProperty(CallEndedEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    return CallEndedEventArgs;
}(CallEventArgs));

var CallErrorType;
(function (CallErrorType) {
    CallErrorType[CallErrorType["Unknown"] = 0] = "Unknown";
})(CallErrorType || (CallErrorType = {}));
var ErrorEventArgs = /** @class */ (function (_super) {
    __extends(ErrorEventArgs, _super);
    function ErrorEventArgs(eventType, type, errorMessage) {
        var _this = _super.call(this, eventType) || this;
        _this.mErrorType = CallErrorType.Unknown;
        _this.mErrorType = type;
        _this.mErrorMessage = errorMessage;
        if (_this.mErrorMessage == null) {
            switch (eventType) {
                //use some generic error messages as the underlaying system doesn't report the errors yet.
                case CallEventType.ConnectionFailed:
                    _this.mErrorMessage = "Connection failed.";
                    break;
                case CallEventType.ListeningFailed:
                    _this.mErrorMessage = "Failed to allow incoming connections. Address already in use or server connection failed.";
                    break;
                default:
                    _this.mErrorMessage = "Unknown error.";
                    break;
            }
        }
        return _this;
    }
    Object.defineProperty(ErrorEventArgs.prototype, "ErrorMessage", {
        get: function () {
            return this.mErrorMessage;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ErrorEventArgs.prototype, "ErrorType", {
        get: function () {
            return this.mErrorType;
        },
        enumerable: true,
        configurable: true
    });
    return ErrorEventArgs;
}(CallEventArgs));

var WaitForIncomingCallEventArgs = /** @class */ (function (_super) {
    __extends(WaitForIncomingCallEventArgs, _super);
    function WaitForIncomingCallEventArgs(address) {
        var _this = _super.call(this, CallEventType.WaitForIncomingCall) || this;
        _this.mAddress = address;
        return _this;
    }
    Object.defineProperty(WaitForIncomingCallEventArgs.prototype, "Address", {
        get: function () {
            return this.mAddress;
        },
        enumerable: true,
        configurable: true
    });
    return WaitForIncomingCallEventArgs;
}(CallEventArgs));

var MessageEventArgs = /** @class */ (function (_super) {
    __extends(MessageEventArgs, _super);
    function MessageEventArgs(id, message, reliable) {
        var _this = _super.call(this, CallEventType.Message) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = id;
        _this.mContent = message;
        _this.mReliable = reliable;
        return _this;
    }
    Object.defineProperty(MessageEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageEventArgs.prototype, "Content", {
        get: function () {
            return this.mContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MessageEventArgs.prototype, "Reliable", {
        get: function () {
            return this.mReliable;
        },
        enumerable: true,
        configurable: true
    });
    return MessageEventArgs;
}(CallEventArgs));

var DataMessageEventArgs = /** @class */ (function (_super) {
    __extends(DataMessageEventArgs, _super);
    function DataMessageEventArgs(id, message, reliable) {
        var _this = _super.call(this, CallEventType.DataMessage) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = id;
        _this.mContent = message;
        _this.mReliable = reliable;
        return _this;
    }
    Object.defineProperty(DataMessageEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataMessageEventArgs.prototype, "Content", {
        get: function () {
            return this.mContent;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataMessageEventArgs.prototype, "Reliable", {
        get: function () {
            return this.mReliable;
        },
        enumerable: true,
        configurable: true
    });
    return DataMessageEventArgs;
}(CallEventArgs));

/**
 * Replaces the FrameUpdateEventArgs. Instead of
 * giving access to video frames only this gives access to
 * video html tag once it is created.
 * TODO: Add audio + video tracks + flag that indicates added, updated or removed
 * after renegotiation is added.
 */
var MediaUpdatedEventArgs = /** @class */ (function (_super) {
    __extends(MediaUpdatedEventArgs, _super);
    function MediaUpdatedEventArgs(conId, videoElement) {
        var _this = _super.call(this, CallEventType.MediaUpdate) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = conId;
        _this.mVideoElement = videoElement;
        return _this;
    }
    Object.defineProperty(MediaUpdatedEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaUpdatedEventArgs.prototype, "IsRemote", {
        /// <summary>
        /// False if the frame is from a local camera. True if it is received from
        /// via network.
        /// </summary>
        get: function () {
            return this.mConnectionId.id != _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaUpdatedEventArgs.prototype, "VideoElement", {
        get: function () {
            return this.mVideoElement;
        },
        enumerable: true,
        configurable: true
    });
    return MediaUpdatedEventArgs;
}(CallEventArgs));

/// <summary>
/// Will be replaced with MediaUpdatedEventArgs.
/// It doesn't make a lot of sense in HTML only
/// </summary>
var FrameUpdateEventArgs = /** @class */ (function (_super) {
    __extends(FrameUpdateEventArgs, _super);
    /// <summary>
    /// Constructor
    /// </summary>
    /// <param name="conId"></param>
    /// <param name="frame"></param>
    function FrameUpdateEventArgs(conId, frame) {
        var _this = _super.call(this, CallEventType.FrameUpdate) || this;
        _this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        _this.mConnectionId = conId;
        _this.mFrame = frame;
        return _this;
    }
    Object.defineProperty(FrameUpdateEventArgs.prototype, "Frame", {
        /// <summary>
        /// Raw image data. Note that the byte array contained in RawFrame will be reused
        /// for the next frames received. Only valid until the next call of ICall.Update
        /// </summary>
        get: function () {
            return this.mFrame;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameUpdateEventArgs.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FrameUpdateEventArgs.prototype, "IsRemote", {
        /// <summary>
        /// False if the frame is from a local camera. True if it is received from
        /// via network.
        /// </summary>
        get: function () {
            return this.mConnectionId.id != _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id;
        },
        enumerable: true,
        configurable: true
    });
    return FrameUpdateEventArgs;
}(CallEventArgs));



/***/ }),

/***/ "./src/awrtc/media/IMediaNetwork.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media/IMediaNetwork.ts ***!
  \******************************************/
/*! exports provided: MediaConfigurationState, MediaEventType, MediaEvent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaConfigurationState", function() { return MediaConfigurationState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaEventType", function() { return MediaEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaEvent", function() { return MediaEvent; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var MediaConfigurationState;
(function (MediaConfigurationState) {
    MediaConfigurationState[MediaConfigurationState["Invalid"] = 0] = "Invalid";
    MediaConfigurationState[MediaConfigurationState["NoConfiguration"] = 1] = "NoConfiguration";
    MediaConfigurationState[MediaConfigurationState["InProgress"] = 2] = "InProgress";
    MediaConfigurationState[MediaConfigurationState["Successful"] = 3] = "Successful";
    MediaConfigurationState[MediaConfigurationState["Failed"] = 4] = "Failed";
})(MediaConfigurationState || (MediaConfigurationState = {}));
var MediaEventType;
(function (MediaEventType) {
    MediaEventType[MediaEventType["Invalid"] = 0] = "Invalid";
    MediaEventType[MediaEventType["StreamAdded"] = 20] = "StreamAdded";
})(MediaEventType || (MediaEventType = {}));
/**
 * Will replace frame event / configuration system in the future.
 *
 * So far it only delivers HTMLVideoElements once connection and
 * all tracks are ready and it plays.
 *
 * This is all temporary and will be updated soon to handle
 * all events from configuration of local streams to frame updates and
 * renegotation.
 *
 */
var MediaEvent = /** @class */ (function () {
    function MediaEvent(type, id, args) {
        this.mEventType = MediaEventType.Invalid;
        this.mConnectionId = _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
        this.mEventType = type;
        this.mConnectionId = id;
        this.mArgs = args;
    }
    Object.defineProperty(MediaEvent.prototype, "EventType", {
        get: function () {
            return this.mEventType;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaEvent.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaEvent.prototype, "Args", {
        get: function () {
            return this.mArgs;
        },
        enumerable: true,
        configurable: true
    });
    return MediaEvent;
}());



/***/ }),

/***/ "./src/awrtc/media/MediaConfig.ts":
/*!****************************************!*\
  !*** ./src/awrtc/media/MediaConfig.ts ***!
  \****************************************/
/*! exports provided: MediaConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaConfig", function() { return MediaConfig; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/// <summary>
/// Configuration for the WebRtcCall class.
///
/// Allows to turn on / off video and audio + configure the used servers to initialize the connection and
/// avoid firewalls.
/// </summary>
var MediaConfig = /** @class */ (function () {
    function MediaConfig() {
        this.mAudio = true;
        this.mVideo = true;
        this.mVideoDeviceName = "";
        this.mMinWidth = -1;
        this.mMinHeight = -1;
        this.mMaxWidth = -1;
        this.mMaxHeight = -1;
        this.mIdealWidth = -1;
        this.mIdealHeight = -1;
        this.mMinFps = -1;
        this.mMaxFps = -1;
        this.mIdealFps = -1;
        this.mFrameUpdates = false;
    }
    Object.defineProperty(MediaConfig.prototype, "Audio", {
        get: function () {
            return this.mAudio;
        },
        set: function (value) {
            this.mAudio = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "Video", {
        get: function () {
            return this.mVideo;
        },
        set: function (value) {
            this.mVideo = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "VideoDeviceName", {
        get: function () {
            return this.mVideoDeviceName;
        },
        set: function (value) {
            this.mVideoDeviceName = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MinWidth", {
        get: function () {
            return this.mMinWidth;
        },
        set: function (value) {
            this.mMinWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MinHeight", {
        get: function () {
            return this.mMinHeight;
        },
        set: function (value) {
            this.mMinHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MaxWidth", {
        get: function () {
            return this.mMaxWidth;
        },
        set: function (value) {
            this.mMaxWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MaxHeight", {
        get: function () {
            return this.mMaxHeight;
        },
        set: function (value) {
            this.mMaxHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "IdealWidth", {
        get: function () {
            return this.mIdealWidth;
        },
        set: function (value) {
            this.mIdealWidth = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "IdealHeight", {
        get: function () {
            return this.mIdealHeight;
        },
        set: function (value) {
            this.mIdealHeight = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MinFps", {
        get: function () {
            return this.mMinFps;
        },
        set: function (value) {
            this.mMinFps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "MaxFps", {
        get: function () {
            return this.mMaxFps;
        },
        set: function (value) {
            this.mMaxFps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "IdealFps", {
        get: function () {
            return this.mIdealFps;
        },
        set: function (value) {
            this.mIdealFps = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(MediaConfig.prototype, "FrameUpdates", {
        /** false - frame updates aren't generated. Useful for browser mode
         *  true  - library will deliver frames as ByteArray
        */
        get: function () {
            return this.mFrameUpdates;
        },
        set: function (value) {
            this.mFrameUpdates = value;
        },
        enumerable: true,
        configurable: true
    });
    return MediaConfig;
}());



/***/ }),

/***/ "./src/awrtc/media/NetworkConfig.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media/NetworkConfig.ts ***!
  \******************************************/
/*! exports provided: NetworkConfig */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkConfig", function() { return NetworkConfig; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
var NetworkConfig = /** @class */ (function () {
    function NetworkConfig() {
        this.mIceServers = new Array();
        this.mSignalingUrl = "ws://because-why-not.com:12776";
        this.mIsConference = false;
    }
    Object.defineProperty(NetworkConfig.prototype, "IceServers", {
        get: function () {
            return this.mIceServers;
        },
        set: function (value) {
            this.mIceServers = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkConfig.prototype, "SignalingUrl", {
        get: function () {
            return this.mSignalingUrl;
        },
        set: function (value) {
            this.mSignalingUrl = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkConfig.prototype, "IsConference", {
        get: function () {
            return this.mIsConference;
        },
        set: function (value) {
            this.mIsConference = value;
        },
        enumerable: true,
        configurable: true
    });
    return NetworkConfig;
}());



/***/ }),

/***/ "./src/awrtc/media/RawFrame.ts":
/*!*************************************!*\
  !*** ./src/awrtc/media/RawFrame.ts ***!
  \*************************************/
/*! exports provided: FramePixelFormat, IFrameData, RawFrame, LazyFrame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "FramePixelFormat", function() { return FramePixelFormat; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IFrameData", function() { return IFrameData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RawFrame", function() { return RawFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LazyFrame", function() { return LazyFrame; });
/* harmony import */ var _network_Helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/Helper */ "./src/awrtc/network/Helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var FramePixelFormat;
(function (FramePixelFormat) {
    FramePixelFormat[FramePixelFormat["Invalid"] = 0] = "Invalid";
    FramePixelFormat[FramePixelFormat["Format32bppargb"] = 1] = "Format32bppargb";
})(FramePixelFormat || (FramePixelFormat = {}));
//replace with interface after typescript 2.0 update (properties in interfaces aren't supported yet)
var IFrameData = /** @class */ (function () {
    function IFrameData() {
    }
    Object.defineProperty(IFrameData.prototype, "Format", {
        get: function () {
            return FramePixelFormat.Format32bppargb;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IFrameData.prototype, "Buffer", {
        get: function () {
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IFrameData.prototype, "Width", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IFrameData.prototype, "Height", {
        get: function () {
            return -1;
        },
        enumerable: true,
        configurable: true
    });
    return IFrameData;
}());

//Container for the raw bytes of the current frame + height and width.
//Format is currently fixed based on the browser getImageData format
var RawFrame = /** @class */ (function (_super) {
    __extends(RawFrame, _super);
    function RawFrame(buffer, width, height) {
        var _this = _super.call(this) || this;
        _this.mBuffer = null;
        _this.mBuffer = buffer;
        _this.mWidth = width;
        _this.mHeight = height;
        return _this;
    }
    Object.defineProperty(RawFrame.prototype, "Buffer", {
        get: function () {
            return this.mBuffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RawFrame.prototype, "Width", {
        get: function () {
            return this.mWidth;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RawFrame.prototype, "Height", {
        get: function () {
            return this.mHeight;
        },
        enumerable: true,
        configurable: true
    });
    return RawFrame;
}(IFrameData));

/**
 * This class is suppose to increase the speed of the java script implementation.
 * Instead of creating RawFrames every Update call (because the real fps are unknown currently) it will
 * only create a lazy frame which will delay the creation of the RawFrame until the user actually tries
 * to access any data.
 * Thus if the game slows down or the user doesn't access any data the expensive copy is avoided.
 */
var LazyFrame = /** @class */ (function (_super) {
    __extends(LazyFrame, _super);
    function LazyFrame(frameGenerator) {
        var _this = _super.call(this) || this;
        _this.mFrameGenerator = frameGenerator;
        return _this;
    }
    Object.defineProperty(LazyFrame.prototype, "FrameGenerator", {
        get: function () {
            return this.mFrameGenerator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyFrame.prototype, "Buffer", {
        get: function () {
            this.GenerateFrame();
            if (this.mRawFrame == null)
                return null;
            return this.mRawFrame.Buffer;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyFrame.prototype, "Width", {
        get: function () {
            this.GenerateFrame();
            if (this.mRawFrame == null)
                return -1;
            return this.mRawFrame.Width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LazyFrame.prototype, "Height", {
        get: function () {
            this.GenerateFrame();
            if (this.mRawFrame == null)
                return -1;
            return this.mRawFrame.Height;
        },
        enumerable: true,
        configurable: true
    });
    //Called before access of any frame data triggering the creation of the raw frame data
    LazyFrame.prototype.GenerateFrame = function () {
        if (this.mRawFrame == null) {
            try {
                this.mRawFrame = this.mFrameGenerator.CreateFrame();
            }
            catch (exception) {
                this.mRawFrame = null;
                _network_Helper__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogWarning("frame skipped in GenerateFrame due to exception: " + JSON.stringify(exception));
            }
        }
    };
    return LazyFrame;
}(IFrameData));



/***/ }),

/***/ "./src/awrtc/media/index.ts":
/*!**********************************!*\
  !*** ./src/awrtc/media/index.ts ***!
  \**********************************/
/*! exports provided: AWebRtcCall, CallEventType, CallEventArgs, CallAcceptedEventArgs, CallEndedEventArgs, CallErrorType, ErrorEventArgs, WaitForIncomingCallEventArgs, MessageEventArgs, DataMessageEventArgs, MediaUpdatedEventArgs, FrameUpdateEventArgs, MediaConfigurationState, MediaEventType, MediaEvent, MediaConfig, NetworkConfig, FramePixelFormat, IFrameData, RawFrame, LazyFrame */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AWebRtcCall */ "./src/awrtc/media/AWebRtcCall.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcCall", function() { return _AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__["AWebRtcCall"]; });

/* harmony import */ var _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CallEventArgs */ "./src/awrtc/media/CallEventArgs.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEventType", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallAcceptedEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallAcceptedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallEndedEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallEndedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallErrorType", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["CallErrorType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ErrorEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["ErrorEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WaitForIncomingCallEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["WaitForIncomingCallEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MessageEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MessageEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DataMessageEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["DataMessageEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaUpdatedEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["MediaUpdatedEventArgs"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FrameUpdateEventArgs", function() { return _CallEventArgs__WEBPACK_IMPORTED_MODULE_1__["FrameUpdateEventArgs"]; });

/* harmony import */ var _IMediaNetwork__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IMediaNetwork */ "./src/awrtc/media/IMediaNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaConfigurationState", function() { return _IMediaNetwork__WEBPACK_IMPORTED_MODULE_2__["MediaConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaEventType", function() { return _IMediaNetwork__WEBPACK_IMPORTED_MODULE_2__["MediaEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaEvent", function() { return _IMediaNetwork__WEBPACK_IMPORTED_MODULE_2__["MediaEvent"]; });

/* harmony import */ var _MediaConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MediaConfig */ "./src/awrtc/media/MediaConfig.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaConfig", function() { return _MediaConfig__WEBPACK_IMPORTED_MODULE_3__["MediaConfig"]; });

/* harmony import */ var _NetworkConfig__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./NetworkConfig */ "./src/awrtc/media/NetworkConfig.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkConfig", function() { return _NetworkConfig__WEBPACK_IMPORTED_MODULE_4__["NetworkConfig"]; });

/* harmony import */ var _RawFrame__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./RawFrame */ "./src/awrtc/media/RawFrame.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "FramePixelFormat", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_5__["FramePixelFormat"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "IFrameData", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_5__["IFrameData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RawFrame", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_5__["RawFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LazyFrame", function() { return _RawFrame__WEBPACK_IMPORTED_MODULE_5__["LazyFrame"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/








/***/ }),

/***/ "./src/awrtc/media_browser/BrowserMediaNetwork.ts":
/*!********************************************************!*\
  !*** ./src/awrtc/media_browser/BrowserMediaNetwork.ts ***!
  \********************************************************/
/*! exports provided: BrowserMediaNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaNetwork", function() { return BrowserMediaNetwork; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../media/IMediaNetwork */ "./src/awrtc/media/IMediaNetwork.ts");
/* harmony import */ var _media_MediaConfig__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../media/MediaConfig */ "./src/awrtc/media/MediaConfig.ts");
/* harmony import */ var _MediaPeer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MediaPeer */ "./src/awrtc/media_browser/MediaPeer.ts");
/* harmony import */ var _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./BrowserMediaStream */ "./src/awrtc/media_browser/BrowserMediaStream.ts");
/* harmony import */ var _DeviceApi__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./DeviceApi */ "./src/awrtc/media_browser/DeviceApi.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/






/**Avoid using this class directly whenever possible. Use BrowserWebRtcCall instead.
 * BrowserMediaNetwork might be subject to frequent changes to keep up with changes
 * in all other platforms.
 *
 * IMediaNetwork implementation for the browser. The class is mostly identical with the
 * C# version. Main goal is to have an interface that can easily be wrapped to other
 * programming languages and gives access to basic WebRTC features such as receiving
 * and sending audio and video + signaling via websockets.
 *
 * BrowserMediaNetwork can be used to stream a local audio and video track to a group of
 * multiple peers and receive remote tracks. The handling of the peers itself
 * remains the same as WebRtcNetwork.
 * Local tracks are created after calling Configure. This will request access from the
 * user. After the user allowed access GetConfigurationState will return Configured.
 * Every incoming and outgoing peer that is established after this will receive
 * the local audio and video track.
 * So far Configure can only be called once before any peers are connected.
 *
 *
 */
var BrowserMediaNetwork = /** @class */ (function (_super) {
    __extends(BrowserMediaNetwork, _super);
    function BrowserMediaNetwork(config) {
        var _this = _super.call(this, BrowserMediaNetwork.BuildSignalingConfig(config.SignalingUrl), BrowserMediaNetwork.BuildRtcConfig(config.IceServers)) || this;
        //media configuration set by the user
        _this.mMediaConfig = null;
        //keeps track of audio / video tracks based on local devices
        //will be shared with all connected peers.
        _this.mLocalStream = null;
        _this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].Invalid;
        _this.mConfigurationError = null;
        _this.mMediaEvents = new _network_index__WEBPACK_IMPORTED_MODULE_0__["Queue"]();
        _this.MediaPeer_InternalMediaStreamAdded = function (peer, stream) {
            _this.EnqueueMediaEvent(_media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaEventType"].StreamAdded, peer.ConnectionId, stream.VideoElement);
        };
        _this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].NoConfiguration;
        return _this;
    }
    /**Triggers the creation of a local audio and video track. After this
     * call the user might get a request to allow access to the requested
     * devices.
     *
     * @param config Detail configuration for audio/video devices.
     */
    BrowserMediaNetwork.prototype.Configure = function (config) {
        var _this = this;
        this.mMediaConfig = config;
        this.mConfigurationError = null;
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].InProgress;
        if (config.Audio || config.Video) {
            //ugly part starts -> call get user media data (no typescript support)
            //different browsers have different calls...
            //check  getSupportedConstraints()???
            //see https://w3c.github.io/mediacapture-main/getusermedia.html#constrainable-interface
            //set default ideal to very common low 320x240 to avoid overloading weak computers
            var constraints = {
                audio: config.Audio
            };
            var width = {};
            var height = {};
            var video = {};
            var fps = {};
            if (config.MinWidth != -1)
                width.min = config.MinWidth;
            if (config.MaxWidth != -1)
                width.max = config.MaxWidth;
            if (config.IdealWidth != -1)
                width.ideal = config.IdealWidth;
            if (config.MinHeight != -1)
                height.min = config.MinHeight;
            if (config.MaxHeight != -1)
                height.max = config.MaxHeight;
            if (config.IdealHeight != -1)
                height.ideal = config.IdealHeight;
            if (config.MinFps != -1)
                fps.min = config.MinFps;
            if (config.MaxFps != -1)
                fps.max = config.MaxFps;
            if (config.IdealFps != -1)
                fps.ideal = config.IdealFps;
            //user requested specific device? get it now to properly add it to the
            //constraints later
            var deviceId = null;
            if (config.Video && config.VideoDeviceName && config.VideoDeviceName !== "") {
                deviceId = _DeviceApi__WEBPACK_IMPORTED_MODULE_5__["DeviceApi"].GetDeviceId(config.VideoDeviceName);
                _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("using device " + config.VideoDeviceName);
                if (deviceId !== null) {
                    //SLog.L("using device id " + deviceId);
                }
                else {
                    _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Failed to find deviceId for label " + config.VideoDeviceName);
                }
            }
            //watch out: unity changed behaviour and will now
            //give 0 / 1 instead of false/true
            //using === won't work
            if (config.Video == false) {
                //video is off
                video = false;
            }
            else {
                if (Object.keys(width).length > 0) {
                    video.width = width;
                }
                if (Object.keys(height).length > 0) {
                    video.height = height;
                }
                if (Object.keys(fps).length > 0) {
                    video.frameRate = fps;
                }
                if (deviceId !== null) {
                    video.deviceId = { "exact": deviceId };
                }
                //if we didn't add anything we need to set it to true
                //at least (I assume?)
                if (Object.keys(video).length == 0) {
                    video = true;
                }
            }
            constraints.video = video;
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("calling GetUserMedia. Media constraints: " + JSON.stringify(constraints));
            if (navigator && navigator.mediaDevices) {
                var promise = navigator.mediaDevices.getUserMedia(constraints);
                promise.then(function (stream) {
                    //totally unrelated -> user gave access to devices. use this
                    //to get the proper names for our DeviceApi
                    _DeviceApi__WEBPACK_IMPORTED_MODULE_5__["DeviceApi"].Update();
                    //call worked -> setup a frame buffer that deals with the rest
                    _this.mLocalStream = new _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_4__["BrowserMediaStream"](stream);
                    _this.mLocalStream.InternalStreamAdded = function (stream) {
                        _this.EnqueueMediaEvent(_media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaEventType"].StreamAdded, _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, _this.mLocalStream.VideoElement);
                    };
                    //unlike native version this one will happily play the local sound causing an echo
                    //set to mute
                    _this.mLocalStream.SetMute(true);
                    _this.OnConfigurationSuccess();
                });
                promise.catch(function (err) {
                    //failed due to an error or user didn't give permissions
                    _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE(err.name + ": " + err.message);
                    _this.OnConfigurationFailed(err.message);
                });
            }
            else {
                //no access to media device -> fail
                var error = "Configuration failed. navigator.mediaDevices is unedfined. The browser might not allow media access." +
                    "Is the page loaded via http or file URL? Some browsers only support https!";
                _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE(error);
                this.OnConfigurationFailed(error);
            }
        }
        else {
            this.OnConfigurationSuccess();
        }
    };
    /**Call this every time a new frame is shown to the user in realtime
     * applications.
     *
     */
    BrowserMediaNetwork.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.mLocalStream != null)
            this.mLocalStream.Update();
    };
    BrowserMediaNetwork.prototype.EnqueueMediaEvent = function (type, id, args) {
        var evt = new _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaEvent"](type, id, args);
        this.mMediaEvents.Enqueue(evt);
    };
    BrowserMediaNetwork.prototype.DequeueMediaEvent = function () {
        return this.mMediaEvents.Dequeue();
    };
    /**
     * Call this every frame after interacting with this instance.
     *
     * This call might flush buffered messages in the future and clear
     * events that the user didn't process to avoid buffer overflows.
     *
     */
    BrowserMediaNetwork.prototype.Flush = function () {
        _super.prototype.Flush.call(this);
        this.mMediaEvents.Clear();
    };
    /**Poll this after Configure is called to get the result.
     * Won't change after state is Configured or Failed.
     *
     */
    BrowserMediaNetwork.prototype.GetConfigurationState = function () {
        return this.mConfigurationState;
    };
    /**Returns the error message if the configure process failed.
     * This usally either happens because the user refused access
     * or no device fulfills the configuration given
     * (e.g. device doesn't support the given resolution)
     *
     */
    BrowserMediaNetwork.prototype.GetConfigurationError = function () {
        return this.mConfigurationError;
    };
    /**Resets the configuration state to allow multiple attempts
     * to call Configure.
     *
     */
    BrowserMediaNetwork.prototype.ResetConfiguration = function () {
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].NoConfiguration;
        this.mMediaConfig = new _media_MediaConfig__WEBPACK_IMPORTED_MODULE_2__["MediaConfig"]();
        this.mConfigurationError = null;
    };
    BrowserMediaNetwork.prototype.OnConfigurationSuccess = function () {
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].Successful;
    };
    BrowserMediaNetwork.prototype.OnConfigurationFailed = function (error) {
        this.mConfigurationError = error;
        this.mConfigurationState = _media_IMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["MediaConfigurationState"].Failed;
    };
    /**Allows to peek at the current frame.
     * Added to allow the emscripten C / C# side to allocate memory before
     * actually getting the frame.
     *
     * @param id
     */
    BrowserMediaNetwork.prototype.PeekFrame = function (id) {
        if (id == null)
            return;
        if (id.id == _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id) {
            if (this.mLocalStream != null) {
                return this.mLocalStream.PeekFrame();
            }
        }
        else {
            var peer = this.IdToConnection[id.id];
            if (peer != null) {
                return peer.PeekFrame();
            }
            //TODO: iterate over media peers and do the same as above
        }
        return null;
    };
    BrowserMediaNetwork.prototype.TryGetFrame = function (id) {
        if (id == null)
            return;
        if (id.id == _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id) {
            if (this.mLocalStream != null) {
                return this.mLocalStream.TryGetFrame();
            }
        }
        else {
            var peer = this.IdToConnection[id.id];
            if (peer != null) {
                return peer.TryGetRemoteFrame();
            }
            //TODO: iterate over media peers and do the same as above
        }
        return null;
    };
    /**
     * Remote audio control for each peer.
     *
     * @param volume 0 - mute and 1 - max volume
     * @param id peer id
     */
    BrowserMediaNetwork.prototype.SetVolume = function (volume, id) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("SetVolume called. Volume: " + volume + " id: " + id.id);
        var peer = this.IdToConnection[id.id];
        if (peer != null) {
            return peer.SetVolume(volume);
        }
    };
    /** Allows to check if a specific peer has a remote
     * audio track attached.
     *
     * @param id
     */
    BrowserMediaNetwork.prototype.HasAudioTrack = function (id) {
        var peer = this.IdToConnection[id.id];
        if (peer != null) {
            return peer.HasAudioTrack();
        }
        return false;
    };
    /** Allows to check if a specific peer has a remote
     * video track attached.
     *
     * @param id
     */
    BrowserMediaNetwork.prototype.HasVideoTrack = function (id) {
        var peer = this.IdToConnection[id.id];
        if (peer != null) {
            return peer.HasVideoTrack();
        }
        return false;
    };
    /**Returns true if no local audio available or it is muted.
     * False if audio is available (could still not work due to 0 volume, hardware
     * volume control or a dummy audio input device is being used)
     */
    BrowserMediaNetwork.prototype.IsMute = function () {
        if (this.mLocalStream != null && this.mLocalStream.Stream != null) {
            var stream = this.mLocalStream.Stream;
            var tracks = stream.getAudioTracks();
            if (tracks.length > 0) {
                if (tracks[0].enabled)
                    return false;
            }
        }
        return true;
    };
    /**Sets the local audio device to mute / unmute it.
     *
     * @param value
     */
    BrowserMediaNetwork.prototype.SetMute = function (value) {
        if (this.mLocalStream != null && this.mLocalStream.Stream != null) {
            var stream = this.mLocalStream.Stream;
            var tracks = stream.getAudioTracks();
            if (tracks.length > 0) {
                tracks[0].enabled = !value;
            }
        }
    };
    BrowserMediaNetwork.prototype.CreatePeer = function (peerId, lRtcConfig) {
        var peer = new _MediaPeer__WEBPACK_IMPORTED_MODULE_3__["MediaPeer"](peerId, lRtcConfig);
        peer.InternalStreamAdded = this.MediaPeer_InternalMediaStreamAdded;
        if (this.mLocalStream != null)
            peer.AddLocalStream(this.mLocalStream.Stream);
        return peer;
    };
    BrowserMediaNetwork.prototype.DisposeInternal = function () {
        _super.prototype.DisposeInternal.call(this);
        this.DisposeLocalStream();
    };
    BrowserMediaNetwork.prototype.DisposeLocalStream = function () {
        if (this.mLocalStream != null) {
            this.mLocalStream.Dispose();
            this.mLocalStream = null;
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L("local buffer disposed");
        }
    };
    BrowserMediaNetwork.BuildSignalingConfig = function (signalingUrl) {
        var signalingNetwork;
        if (signalingUrl == null || signalingUrl == "") {
            signalingNetwork = new _network_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"]();
        }
        else {
            signalingNetwork = new _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"](signalingUrl);
        }
        return new _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingConfig"](signalingNetwork);
    };
    BrowserMediaNetwork.BuildRtcConfig = function (servers) {
        var rtcConfig = { iceServers: servers };
        return rtcConfig;
    };
    return BrowserMediaNetwork;
}(_network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"]));



/***/ }),

/***/ "./src/awrtc/media_browser/BrowserMediaStream.ts":
/*!*******************************************************!*\
  !*** ./src/awrtc/media_browser/BrowserMediaStream.ts ***!
  \*******************************************************/
/*! exports provided: BrowserMediaStream */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaStream", function() { return BrowserMediaStream; });
/* harmony import */ var _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../media/RawFrame */ "./src/awrtc/media/RawFrame.ts");
/* harmony import */ var _network_Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../network/Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**Internal use only.
 * Bundles all functionality related to MediaStream, Tracks and video processing.
 * It creates two HTML elements: Video and Canvas to interact with the video stream
 * and convert the visible frame data to Uint8Array for compatibility with the
 * unity plugin and all other platforms.
 *
 */
var BrowserMediaStream = /** @class */ (function () {
    function BrowserMediaStream(stream) {
        this.mBufferedFrame = null;
        this.mInstanceId = 0;
        this.mCanvasElement = null;
        this.mIsActive = false;
        this.mMsPerFrame = 1.0 / BrowserMediaStream.DEFAULT_FRAMERATE * 1000;
        this.mFrameRateKnown = false;
        //Time the last frame was generated
        this.mLastFrameTime = 0;
        /** Number of the last frame (not yet supported in all browsers)
         * if it remains at <= 0 then we just generate frames based on
         * the timer above
         */
        this.mLastFrameNumber = 0;
        this.mHasVideo = false;
        this.InternalStreamAdded = null;
        this.mStream = stream;
        this.mInstanceId = BrowserMediaStream.sNextInstanceId;
        BrowserMediaStream.sNextInstanceId++;
        if (this.mStream.getVideoTracks().length > 0) {
            this.mHasVideo = true;
            var vtrack = this.mStream.getVideoTracks()[0];
            var settings = vtrack.getSettings();
            var fps = settings.frameRate;
            if (fps) {
                this.mMsPerFrame = 1.0 / fps * 1000;
                this.mFrameRateKnown = true;
            }
        }
        this.SetupElements();
    }
    Object.defineProperty(BrowserMediaStream.prototype, "Stream", {
        get: function () {
            return this.mStream;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BrowserMediaStream.prototype, "VideoElement", {
        get: function () {
            return this.mVideoElement;
        },
        enumerable: true,
        configurable: true
    });
    BrowserMediaStream.prototype.CheckFrameRate = function () {
        //in chrome the track itself might miss the framerate but
        //we still know when it updates trough webkitDecodedFrameCount
        if (this.mVideoElement && typeof this.mVideoElement.webkitDecodedFrameCount !== "undefined") {
            this.mFrameRateKnown = true;
        }
        if (this.mFrameRateKnown === false) {
            //firefox and co won't tell us the FPS for remote stream
            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Framerate unknown. Using default framerate of " + BrowserMediaStream.DEFAULT_FRAMERATE);
        }
    };
    BrowserMediaStream.prototype.SetupElements = function () {
        var _this = this;
        this.mVideoElement = this.SetupVideoElement();
        //TOOD: investigate bug here
        //In some cases onloadedmetadata is never called. This might happen due to a 
        //bug in firefox or might be related to a device / driver error
        //So far it only happens randomly (maybe 1 in 10 tries) on a single test device and only
        //with 720p. (video device "BisonCam, NB Pro" on MSI laptop)
        _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("video element created. video tracks: " + this.mStream.getVideoTracks().length);
        this.mVideoElement.onloadedmetadata = function (e) {
            //we might have shutdown everything by now already
            if (_this.mVideoElement == null)
                return;
            var playPromise = _this.mVideoElement.play();
            if (typeof playPromise !== "undefined") {
                playPromise.then(function () {
                    //all good
                }).catch(function (error) {
                    //so far we can't handle this error automatically. Some situation this might trigger
                    //Chrome & Firefox: User only receives audio but doesn't send it & the call was initiated without the user pressing a button.
                    //Safari: This seems to trigger always on safari unless the user manually allows autoplay
                    _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LE("Replay of video failed. This error is likely caused due to autoplay restrictions of the browser. Try allowing autoplay.");
                    console.error(error);
                });
            }
            if (_this.InternalStreamAdded != null)
                _this.InternalStreamAdded(_this);
            _this.CheckFrameRate();
            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Resolution: " + _this.mVideoElement.videoWidth + "x" + _this.mVideoElement.videoHeight);
            //now create canvas after the meta data of the video are known
            if (_this.mHasVideo) {
                _this.mCanvasElement = _this.SetupCanvas();
                //canvas couldn't be created. set video to false
                if (_this.mCanvasElement == null)
                    _this.mHasVideo = false;
            }
            else {
                _this.mCanvasElement = null;
            }
            _this.mIsActive = true;
        };
        //set the src value and trigger onloadedmetadata above
        try {
            //newer method. not yet supported everywhere
            var element = this.mVideoElement;
            element.srcObject = this.mStream;
        }
        catch (error) {
            //old way of doing it. won't work anymore in firefox and possibly other browsers
            this.mVideoElement.src = window.URL.createObjectURL(this.mStream);
        }
    };
    /** Returns the current frame number.
     *  Treat a return value of 0 or smaller as unknown.
     * (Browsers might have the property but
     * always return 0)
     */
    BrowserMediaStream.prototype.GetFrameNumber = function () {
        var frameNumber;
        if (this.mVideoElement) {
            //to find out if we got a new frame
            //chrome has webkitDecodedFrameCount
            //firefox mozDecodedFrames, mozParsedFrames,  mozPresentedFrames seems to be always 0 so far
            //mozPaintedFrames turned out useless as it only updates if the tag is visible
            //no idea about all others
            //
            frameNumber = this.mVideoElement.webkitDecodedFrameCount
                //|| this.mVideoElement.currentTime can't be used updates every call
                || -1;
        }
        else {
            frameNumber = -1;
        }
        return frameNumber;
    };
    //TODO: Buffering
    BrowserMediaStream.prototype.TryGetFrame = function () {
        //make sure we get the newest frame
        this.EnsureLatestFrame();
        //remove the buffered frame if any
        var result = this.mBufferedFrame;
        this.mBufferedFrame = null;
        return result;
    };
    BrowserMediaStream.prototype.SetMute = function (mute) {
        this.mVideoElement.muted = mute;
    };
    BrowserMediaStream.prototype.PeekFrame = function () {
        this.EnsureLatestFrame();
        return this.mBufferedFrame;
    };
    /** Ensures we have the latest frame ready
     * for the next PeekFrame / TryGetFrame calls
     */
    BrowserMediaStream.prototype.EnsureLatestFrame = function () {
        if (this.HasNewerFrame()) {
            this.FrameToBuffer();
            return true;
        }
        return false;
    };
    /** checks if the html tag has a newer frame available
     * (or if 1/30th of a second passed since last frame if
     * this info isn't available)
     */
    BrowserMediaStream.prototype.HasNewerFrame = function () {
        if (this.mIsActive
            && this.mHasVideo
            && this.mCanvasElement != null) {
            if (this.mLastFrameNumber > 0) {
                //we are getting frame numbers. use those to 
                //check if we have a new one
                if (this.GetFrameNumber() > this.mLastFrameNumber) {
                    return true;
                }
            }
            else {
                //many browsers do not share the frame info
                //so far we just generate 30 FPS as a work around
                var now = new Date().getTime();
                var div = now - this.mLastFrameTime;
                if (div >= this.mMsPerFrame) {
                    {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    BrowserMediaStream.prototype.Update = function () {
        //moved to avoid creating buffered frames if not needed
        //this.EnsureLatestFrame();
    };
    BrowserMediaStream.prototype.DestroyCanvas = function () {
        if (this.mCanvasElement != null && this.mCanvasElement.parentElement != null) {
            this.mCanvasElement.parentElement.removeChild(this.mCanvasElement);
        }
    };
    BrowserMediaStream.prototype.Dispose = function () {
        this.mIsActive = false;
        this.DestroyCanvas();
        if (this.mVideoElement != null && this.mVideoElement.parentElement != null) {
            this.mVideoElement.parentElement.removeChild(this.mVideoElement);
        }
        //track cleanup is probably not needed but
        //it might help ensure it properly stops
        //in case there are other references out there
        var tracks = this.mStream.getTracks();
        for (var i = 0; i < tracks.length; i++) {
            tracks[i].stop();
        }
        this.mStream = null;
        this.mVideoElement = null;
        this.mCanvasElement = null;
    };
    BrowserMediaStream.prototype.CreateFrame = function () {
        this.mCanvasElement.width = this.mVideoElement.videoWidth;
        this.mCanvasElement.height = this.mVideoElement.videoHeight;
        var ctx = this.mCanvasElement.getContext("2d");
        var fillBackgroundFirst = true;
        if (fillBackgroundFirst) {
            ctx.clearRect(0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
        }
        ctx.drawImage(this.mVideoElement, 0, 0);
        try {
            //risk of security exception in firefox
            var imgData = ctx.getImageData(0, 0, this.mCanvasElement.width, this.mCanvasElement.height);
            var imgRawData = imgData.data;
            var array = new Uint8Array(imgRawData.buffer);
            return new _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__["RawFrame"](array, this.mCanvasElement.width, this.mCanvasElement.height);
        }
        catch (exception) {
            //show white frame for now
            var array = new Uint8Array(this.mCanvasElement.width * this.mCanvasElement.height * 4);
            array.fill(255, 0, array.length - 1);
            var res = new _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__["RawFrame"](array, this.mCanvasElement.width, this.mCanvasElement.height);
            //attempted workaround for firefox bug / suspected cause: 
            // * root cause seems to be an internal origin-clean flag within the canvas. If set to false reading from the
            //   canvas triggers a security exceptions. This is usually used if the canvas contains data that isn't 
            //   suppose to be accessible e.g. a picture from another domain
            // * while moving the image to the canvas the origin-clean flag seems to be set to false but only 
            //   during the first few frames. (maybe a race condition within firefox? A higher CPU workload increases the risk)
            // * the canvas will work and look just fine but calling getImageData isn't allowed anymore
            // * After a few frames the video is back to normal but the canvas will still have the flag set to false
            // 
            //Solution:
            // * Recreate the canvas if the exception is triggered. During the next few frames firefox should get its flag right
            //   and then stop causing the error. It might recreate the canvas multiple times until it finally works as we
            //   can't detect if the video element will trigger the issue until we tried to access the data
            _network_Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("Firefox workaround: Refused access to the remote video buffer. Retrying next frame...");
            this.DestroyCanvas();
            this.mCanvasElement = this.SetupCanvas();
            return res;
        }
    };
    BrowserMediaStream.prototype.FrameToBuffer = function () {
        this.mLastFrameTime = new Date().getTime();
        this.mLastFrameNumber = this.GetFrameNumber();
        this.mBufferedFrame = new _media_RawFrame__WEBPACK_IMPORTED_MODULE_0__["LazyFrame"](this);
    };
    BrowserMediaStream.prototype.SetupVideoElement = function () {
        var videoElement = document.createElement("video");
        //width/doesn't seem to be important
        videoElement.width = 320;
        videoElement.height = 240;
        videoElement.controls = true;
        videoElement.id = "awrtc_mediastream_video_" + this.mInstanceId;
        //videoElement.muted = true;
        if (BrowserMediaStream.DEBUG_SHOW_ELEMENTS)
            document.body.appendChild(videoElement);
        return videoElement;
    };
    BrowserMediaStream.prototype.SetupCanvas = function () {
        if (this.mVideoElement == null || this.mVideoElement.videoWidth <= 0 ||
            this.mVideoElement.videoHeight <= 0)
            return null;
        var canvas = document.createElement("canvas");
        canvas.width = this.mVideoElement.videoWidth;
        canvas.height = this.mVideoElement.videoHeight;
        canvas.id = "awrtc_mediastream_canvas_" + this.mInstanceId;
        if (BrowserMediaStream.DEBUG_SHOW_ELEMENTS)
            document.body.appendChild(canvas);
        return canvas;
    };
    BrowserMediaStream.prototype.SetVolume = function (volume) {
        if (this.mVideoElement == null) {
            return;
        }
        if (volume < 0)
            volume = 0;
        if (volume > 1)
            volume = 1;
        this.mVideoElement.volume = volume;
    };
    BrowserMediaStream.prototype.HasAudioTrack = function () {
        if (this.mStream != null && this.mStream.getAudioTracks() != null
            && this.mStream.getAudioTracks().length > 0) {
            return true;
        }
        return false;
    };
    BrowserMediaStream.prototype.HasVideoTrack = function () {
        if (this.mStream != null && this.mStream.getVideoTracks() != null
            && this.mStream.getVideoTracks().length > 0) {
            return true;
        }
        return false;
    };
    //no double buffering in java script as it forces us to create a new frame each time
    //for debugging. Will attach the HTMLVideoElement used to play the local and remote
    //video streams to the document.
    BrowserMediaStream.DEBUG_SHOW_ELEMENTS = false;
    //TODO: remove this flag. it is now always using lazy frames
    BrowserMediaStream.sUseLazyFrames = true;
    //Gives each FrameBuffer and its HTMLVideoElement a fixed id for debugging purposes.
    BrowserMediaStream.sNextInstanceId = 1;
    //Framerate used as a workaround if
    //the actual framerate is unknown due to browser restrictions
    BrowserMediaStream.DEFAULT_FRAMERATE = 25;
    return BrowserMediaStream;
}());



/***/ }),

/***/ "./src/awrtc/media_browser/BrowserWebRtcCall.ts":
/*!******************************************************!*\
  !*** ./src/awrtc/media_browser/BrowserWebRtcCall.ts ***!
  \******************************************************/
/*! exports provided: BrowserWebRtcCall */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BrowserWebRtcCall", function() { return BrowserWebRtcCall; });
/* harmony import */ var _media_AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../media/AWebRtcCall */ "./src/awrtc/media/AWebRtcCall.ts");
/* harmony import */ var _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrowserMediaNetwork */ "./src/awrtc/media_browser/BrowserMediaNetwork.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**Browser version of the C# version of WebRtcCall.
 *
 * See ICall interface for detailed documentation.
 * BrowserWebRtcCall mainly exists to allow other versions
 * in the future that might build on a different IMediaNetwork
 * interface (Maybe something running inside Webassembly?).
 */
var BrowserWebRtcCall = /** @class */ (function (_super) {
    __extends(BrowserWebRtcCall, _super);
    function BrowserWebRtcCall(config) {
        var _this = _super.call(this, config) || this;
        _this.Initialize(_this.CreateNetwork());
        return _this;
    }
    BrowserWebRtcCall.prototype.CreateNetwork = function () {
        return new _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_1__["BrowserMediaNetwork"](this.mNetworkConfig);
    };
    BrowserWebRtcCall.prototype.DisposeInternal = function (disposing) {
        _super.prototype.DisposeInternal.call(this, disposing);
        if (disposing) {
            if (this.mNetwork != null)
                this.mNetwork.Dispose();
            this.mNetwork = null;
        }
    };
    return BrowserWebRtcCall;
}(_media_AWebRtcCall__WEBPACK_IMPORTED_MODULE_0__["AWebRtcCall"]));



/***/ }),

/***/ "./src/awrtc/media_browser/DeviceApi.ts":
/*!**********************************************!*\
  !*** ./src/awrtc/media_browser/DeviceApi.ts ***!
  \**********************************************/
/*! exports provided: DeviceInfo, DeviceApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceInfo", function() { return DeviceInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceApi", function() { return DeviceApi; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var DeviceInfo = /** @class */ (function () {
    function DeviceInfo() {
        this.deviceId = null;
        this.defaultLabel = null;
        this.label = null;
        this.isLabelGuessed = true;
    }
    return DeviceInfo;
}());

var DeviceApi = /** @class */ (function () {
    function DeviceApi() {
    }
    Object.defineProperty(DeviceApi, "LastUpdate", {
        get: function () {
            return DeviceApi.sLastUpdate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceApi, "HasInfo", {
        get: function () {
            return DeviceApi.sLastUpdate > 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceApi, "IsPending", {
        get: function () {
            return DeviceApi.sIsPending;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DeviceApi, "LastError", {
        get: function () {
            return this.sLastError;
        },
        enumerable: true,
        configurable: true
    });
    DeviceApi.AddOnChangedHandler = function (evt) {
        DeviceApi.sUpdateEvents.push(evt);
    };
    DeviceApi.RemOnChangedHandler = function (evt) {
        var index = DeviceApi.sUpdateEvents.indexOf(evt);
        if (index >= 0)
            DeviceApi.sUpdateEvents.splice(index, 1);
    };
    DeviceApi.TriggerChangedEvent = function () {
        for (var _i = 0, _a = DeviceApi.sUpdateEvents; _i < _a.length; _i++) {
            var v = _a[_i];
            try {
                v();
            }
            catch (e) {
                _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Error in DeviceApi user event handler: " + e);
                console.exception(e);
            }
        }
    };
    Object.defineProperty(DeviceApi, "Devices", {
        get: function () {
            return DeviceApi.sDeviceInfo;
        },
        enumerable: true,
        configurable: true
    });
    DeviceApi.Reset = function () {
        DeviceApi.sUpdateEvents = [];
        DeviceApi.sLastUpdate = 0;
        DeviceApi.sDeviceInfo = {};
        DeviceApi.sVideoDeviceCounter = 1;
        DeviceApi.sAccessStream = null;
        DeviceApi.sLastError = null;
        DeviceApi.sIsPending = false;
    };
    /**Updates the device list based on the current
     * access. Gives the devices numbers if the name isn't known.
     */
    DeviceApi.Update = function () {
        DeviceApi.sLastError = null;
        if (DeviceApi.IsApiAvailable()) {
            DeviceApi.sIsPending = true;
            navigator.mediaDevices.enumerateDevices()
                .then(DeviceApi.InternalOnEnum)
                .catch(DeviceApi.InternalOnErrorCatch);
        }
        else {
            DeviceApi.InternalOnErrorString("Can't access mediaDevices or enumerateDevices");
        }
    };
    /**Checks if the API is available in the browser.
     * false - browser doesn't support this API
     * true - browser supports the API (might still refuse to give
     * us access later on)
     */
    DeviceApi.IsApiAvailable = function () {
        if (navigator && navigator.mediaDevices && navigator.mediaDevices.enumerateDevices)
            return true;
        return false;
    };
    /**Asks the user for access first to get the full
     * device names.
     */
    DeviceApi.RequestUpdate = function () {
        DeviceApi.sLastError = null;
        if (DeviceApi.IsApiAvailable()) {
            DeviceApi.sIsPending = true;
            var constraints = { video: true };
            navigator.mediaDevices.getUserMedia(constraints)
                .then(DeviceApi.InternalOnStream)
                .catch(DeviceApi.InternalOnErrorCatch);
        }
        else {
            DeviceApi.InternalOnErrorString("Can't access mediaDevices or enumerateDevices");
        }
    };
    DeviceApi.GetDeviceId = function (label) {
        var devs = DeviceApi.Devices;
        for (var key in devs) {
            var dev = devs[key];
            if (dev.label == label || dev.defaultLabel == label || dev.deviceId == label) {
                return dev.deviceId;
            }
        }
        return null;
    };
    DeviceApi.sLastUpdate = 0;
    DeviceApi.sIsPending = false;
    DeviceApi.sLastError = null;
    DeviceApi.sDeviceInfo = {};
    DeviceApi.sVideoDeviceCounter = 1;
    DeviceApi.sAccessStream = null;
    DeviceApi.sUpdateEvents = [];
    DeviceApi.InternalOnEnum = function (devices) {
        DeviceApi.sIsPending = false;
        DeviceApi.sLastUpdate = new Date().getTime();
        var newDeviceInfo = {};
        for (var _i = 0, devices_1 = devices; _i < devices_1.length; _i++) {
            var info = devices_1[_i];
            if (info.kind != "videoinput")
                continue;
            var newInfo = new DeviceInfo();
            newInfo.deviceId = info.deviceId;
            var knownInfo = null;
            if (newInfo.deviceId in DeviceApi.Devices) {
                //known device. reuse the default label
                knownInfo = DeviceApi.Devices[newInfo.deviceId];
            }
            //check if we gave this device a default label already
            //this is used to identify it via a user readable name in case
            //we update multiple times with proper labels / default labels
            if (knownInfo != null) {
                newInfo.defaultLabel = knownInfo.defaultLabel;
            }
            else {
                newInfo.defaultLabel = info.kind + " " + DeviceApi.sVideoDeviceCounter;
                ;
                DeviceApi.sVideoDeviceCounter++;
            }
            //check if we know a proper label or got one this update
            if (knownInfo != null && knownInfo.isLabelGuessed == false) {
                //already have one
                newInfo.label = knownInfo.label;
                newInfo.isLabelGuessed = false;
            }
            else if (info.label) {
                //got a new one
                newInfo.label = info.label;
                newInfo.isLabelGuessed = false;
            }
            else {
                //no known label -> just use the default one
                newInfo.label = newInfo.defaultLabel;
                newInfo.isLabelGuessed = true;
            }
            newDeviceInfo[newInfo.deviceId] = newInfo;
        }
        DeviceApi.sDeviceInfo = newDeviceInfo;
        if (DeviceApi.sAccessStream) {
            var tracks = DeviceApi.sAccessStream.getTracks();
            for (var i = 0; i < tracks.length; i++) {
                tracks[i].stop();
            }
            DeviceApi.sAccessStream = null;
        }
        DeviceApi.TriggerChangedEvent();
    };
    DeviceApi.InternalOnErrorCatch = function (err) {
        var txt = err.toString();
        DeviceApi.InternalOnErrorString(txt);
    };
    DeviceApi.InternalOnErrorString = function (err) {
        DeviceApi.sIsPending = false;
        DeviceApi.sLastError = err;
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE(err);
        DeviceApi.TriggerChangedEvent();
    };
    DeviceApi.InternalOnStream = function (stream) {
        DeviceApi.sAccessStream = stream;
        DeviceApi.Update();
    };
    return DeviceApi;
}());



/***/ }),

/***/ "./src/awrtc/media_browser/MediaPeer.ts":
/*!**********************************************!*\
  !*** ./src/awrtc/media_browser/MediaPeer.ts ***!
  \**********************************************/
/*! exports provided: MediaPeer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaPeer", function() { return MediaPeer; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrowserMediaStream */ "./src/awrtc/media_browser/BrowserMediaStream.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var MediaPeer = /** @class */ (function (_super) {
    __extends(MediaPeer, _super);
    function MediaPeer() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mRemoteStream = null;
        //quick workaround to allow html user to get the HTMLVideoElement once it is
        //created. Might be done via events later to make wrapping to unity/emscripten possible
        _this.InternalStreamAdded = null;
        return _this;
    }
    MediaPeer.prototype.OnSetup = function () {
        var _this = this;
        _super.prototype.OnSetup.call(this);
        //TODO: test in different browsers if boolean works now
        //this is unclear in the API. according to typescript they are boolean, in native code they are int
        //and some browser failed in the past if boolean was used ... 
        this.mOfferOptions = { "offerToReceiveAudio": true, "offerToReceiveVideo": true };
        if (MediaPeer.sUseObsolete) {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LW("Using obsolete onaddstream as not all browsers support ontrack");
            this.mPeer.onaddstream = function (streamEvent) { _this.OnAddStream(streamEvent); };
        }
        else {
            this.mPeer.ontrack = function (ev) { _this.OnTrack(ev); };
        }
    };
    MediaPeer.prototype.OnCleanup = function () {
        _super.prototype.OnCleanup.call(this);
        if (this.mRemoteStream != null) {
            this.mRemoteStream.Dispose();
            this.mRemoteStream = null;
        }
    };
    MediaPeer.prototype.OnAddStream = function (streamEvent) {
        this.SetupStream(streamEvent.stream);
    };
    MediaPeer.prototype.OnTrack = function (ev) {
        if (ev && ev.streams && ev.streams.length > 0) {
            //this is getting called twice if audio and video is active
            if (this.mRemoteStream == null)
                this.SetupStream(ev.streams[0]);
        }
        else {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Unexpected RTCTrackEvent: " + JSON.stringify(ev));
        }
    };
    MediaPeer.prototype.SetupStream = function (stream) {
        var _this = this;
        this.mRemoteStream = new _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_1__["BrowserMediaStream"](stream);
        //trigger events once the stream has its meta data available
        this.mRemoteStream.InternalStreamAdded = function (stream) {
            if (_this.InternalStreamAdded != null) {
                _this.InternalStreamAdded(_this, stream);
            }
        };
    };
    MediaPeer.prototype.TryGetRemoteFrame = function () {
        if (this.mRemoteStream == null)
            return null;
        return this.mRemoteStream.TryGetFrame();
    };
    MediaPeer.prototype.PeekFrame = function () {
        if (this.mRemoteStream == null)
            return null;
        return this.mRemoteStream.PeekFrame();
    };
    MediaPeer.prototype.AddLocalStream = function (stream) {
        if (MediaPeer.sUseObsolete) {
            this.mPeer.addStream(stream);
        }
        else {
            for (var _i = 0, _a = stream.getTracks(); _i < _a.length; _i++) {
                var v = _a[_i];
                this.mPeer.addTrack(v, stream);
            }
        }
    };
    MediaPeer.prototype.Update = function () {
        _super.prototype.Update.call(this);
        if (this.mRemoteStream != null) {
            this.mRemoteStream.Update();
        }
    };
    MediaPeer.prototype.SetVolume = function (volume) {
        if (this.mRemoteStream != null)
            this.mRemoteStream.SetVolume(volume);
    };
    MediaPeer.prototype.HasAudioTrack = function () {
        if (this.mRemoteStream != null)
            return this.mRemoteStream.HasAudioTrack();
        return false;
    };
    MediaPeer.prototype.HasVideoTrack = function () {
        if (this.mRemoteStream != null)
            return this.mRemoteStream.HasVideoTrack();
        return false;
    };
    //true - will use obsolete onstream / add stream
    //false - will use ontrack / addtrack (seems to work fine now even on chrome)
    MediaPeer.sUseObsolete = false;
    return MediaPeer;
}(_network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcDataPeer"]));



/***/ }),

/***/ "./src/awrtc/media_browser/index.ts":
/*!******************************************!*\
  !*** ./src/awrtc/media_browser/index.ts ***!
  \******************************************/
/*! exports provided: BrowserMediaNetwork, BrowserWebRtcCall, BrowserMediaStream, MediaPeer, DeviceInfo, DeviceApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BrowserMediaNetwork */ "./src/awrtc/media_browser/BrowserMediaNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaNetwork", function() { return _BrowserMediaNetwork__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaNetwork"]; });

/* harmony import */ var _BrowserWebRtcCall__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BrowserWebRtcCall */ "./src/awrtc/media_browser/BrowserWebRtcCall.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserWebRtcCall", function() { return _BrowserWebRtcCall__WEBPACK_IMPORTED_MODULE_1__["BrowserWebRtcCall"]; });

/* harmony import */ var _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./BrowserMediaStream */ "./src/awrtc/media_browser/BrowserMediaStream.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserMediaStream", function() { return _BrowserMediaStream__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaStream"]; });

/* harmony import */ var _MediaPeer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./MediaPeer */ "./src/awrtc/media_browser/MediaPeer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaPeer", function() { return _MediaPeer__WEBPACK_IMPORTED_MODULE_3__["MediaPeer"]; });

/* harmony import */ var _DeviceApi__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./DeviceApi */ "./src/awrtc/media_browser/DeviceApi.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceInfo", function() { return _DeviceApi__WEBPACK_IMPORTED_MODULE_4__["DeviceInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceApi", function() { return _DeviceApi__WEBPACK_IMPORTED_MODULE_4__["DeviceApi"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/







/***/ }),

/***/ "./src/awrtc/network/Helper.ts":
/*!*************************************!*\
  !*** ./src/awrtc/network/Helper.ts ***!
  \*************************************/
/*! exports provided: Queue, List, Output, Debug, Encoder, UTF16Encoding, Encoding, Random, Helper, SLogLevel, SLog */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return Queue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "List", function() { return List; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return Output; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Debug", function() { return Debug; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return Encoder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UTF16Encoding", function() { return UTF16Encoding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Encoding", function() { return Encoding; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return Random; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return Helper; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SLogLevel", function() { return SLogLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SLog", function() { return SLog; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**Contains some helper classes to keep the typescript implementation
 * similar to the C# implementation.
 *
 */
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Queue = /** @class */ (function () {
    function Queue() {
        this.mArr = new Array();
    }
    Queue.prototype.Enqueue = function (val) {
        this.mArr.push(val);
    };
    Queue.prototype.TryDequeue = function (outp) {
        var res = false;
        if (this.mArr.length > 0) {
            outp.val = this.mArr.shift();
            res = true;
        }
        return res;
    };
    Queue.prototype.Dequeue = function () {
        if (this.mArr.length > 0) {
            return this.mArr.shift();
        }
        else {
            return null;
        }
    };
    Queue.prototype.Peek = function () {
        if (this.mArr.length > 0) {
            return this.mArr[0];
        }
        else {
            return null;
        }
    };
    Queue.prototype.Count = function () {
        return this.mArr.length;
    };
    Queue.prototype.Clear = function () {
        this.mArr = new Array();
    };
    return Queue;
}());

var List = /** @class */ (function () {
    function List() {
        this.mArr = new Array();
    }
    Object.defineProperty(List.prototype, "Internal", {
        get: function () {
            return this.mArr;
        },
        enumerable: true,
        configurable: true
    });
    List.prototype.Add = function (val) {
        this.mArr.push(val);
    };
    Object.defineProperty(List.prototype, "Count", {
        get: function () {
            return this.mArr.length;
        },
        enumerable: true,
        configurable: true
    });
    return List;
}());

var Output = /** @class */ (function () {
    function Output() {
    }
    return Output;
}());

var Debug = /** @class */ (function () {
    function Debug() {
    }
    Debug.Log = function (s) {
        SLog.Log(s);
    };
    Debug.LogError = function (s) {
        SLog.LogError(s);
    };
    Debug.LogWarning = function (s) {
        SLog.LogWarning(s);
    };
    return Debug;
}());

var Encoder = /** @class */ (function () {
    function Encoder() {
    }
    return Encoder;
}());

var UTF16Encoding = /** @class */ (function (_super) {
    __extends(UTF16Encoding, _super);
    function UTF16Encoding() {
        return _super.call(this) || this;
    }
    UTF16Encoding.prototype.GetBytes = function (text) {
        return this.stringToBuffer(text);
    };
    UTF16Encoding.prototype.GetString = function (buffer) {
        return this.bufferToString(buffer);
    };
    UTF16Encoding.prototype.bufferToString = function (buffer) {
        var arr = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
        return String.fromCharCode.apply(null, arr);
    };
    UTF16Encoding.prototype.stringToBuffer = function (str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        var result = new Uint8Array(buf);
        return result;
    };
    return UTF16Encoding;
}(Encoder));

var Encoding = /** @class */ (function () {
    function Encoding() {
    }
    Object.defineProperty(Encoding, "UTF16", {
        get: function () {
            return new UTF16Encoding();
        },
        enumerable: true,
        configurable: true
    });
    return Encoding;
}());

var Random = /** @class */ (function () {
    function Random() {
    }
    Random.getRandomInt = function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min;
    };
    return Random;
}());

var Helper = /** @class */ (function () {
    function Helper() {
    }
    Helper.tryParseInt = function (value) {
        try {
            if (/^(\-|\+)?([0-9]+)$/.test(value)) {
                var result = Number(value);
                if (isNaN(result) == false)
                    return result;
            }
        }
        catch (e) {
        }
        return null;
    };
    return Helper;
}());

var SLogLevel;
(function (SLogLevel) {
    SLogLevel[SLogLevel["None"] = 0] = "None";
    SLogLevel[SLogLevel["Errors"] = 1] = "Errors";
    SLogLevel[SLogLevel["Warnings"] = 2] = "Warnings";
    SLogLevel[SLogLevel["Info"] = 3] = "Info";
})(SLogLevel || (SLogLevel = {}));
//Simplified logger
var SLog = /** @class */ (function () {
    function SLog() {
    }
    SLog.SetLogLevel = function (level) {
        SLog.sLogLevel = level;
    };
    SLog.RequestLogLevel = function (level) {
        if (level > SLog.sLogLevel)
            SLog.sLogLevel = level;
    };
    SLog.L = function (msg, tag) {
        SLog.Log(msg, tag);
    };
    SLog.LW = function (msg, tag) {
        SLog.LogWarning(msg, tag);
    };
    SLog.LE = function (msg, tag) {
        SLog.LogError(msg, tag);
    };
    SLog.Log = function (msg, tag) {
        if (!tag)
            tag = "";
        if (SLog.sLogLevel >= SLogLevel.Info)
            console.log(msg, tag);
    };
    SLog.LogWarning = function (msg, tag) {
        if (!tag)
            tag = "";
        if (SLog.sLogLevel >= SLogLevel.Warnings)
            console.warn(msg, tag);
    };
    SLog.LogError = function (msg, tag) {
        if (!tag)
            tag = "";
        if (SLog.sLogLevel >= SLogLevel.Errors)
            console.error(msg, tag);
    };
    SLog.sLogLevel = SLogLevel.Warnings;
    return SLog;
}());



/***/ }),

/***/ "./src/awrtc/network/INetwork.ts":
/*!***************************************!*\
  !*** ./src/awrtc/network/INetwork.ts ***!
  \***************************************/
/*! exports provided: NetEventType, NetEventDataType, NetworkEvent, ConnectionId */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetEventType", function() { return NetEventType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetEventDataType", function() { return NetEventDataType; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NetworkEvent", function() { return NetworkEvent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ConnectionId", function() { return ConnectionId; });
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/** Abstract interfaces and serialization to keep different
 * versions compatible to each other.
 *
 * Watch out before changing anything in this file. Content is reused
 * between webclient, signaling server and needs to remain compatible to
 * the C# implementation.
 */

var NetEventType;
(function (NetEventType) {
    NetEventType[NetEventType["Invalid"] = 0] = "Invalid";
    NetEventType[NetEventType["UnreliableMessageReceived"] = 1] = "UnreliableMessageReceived";
    NetEventType[NetEventType["ReliableMessageReceived"] = 2] = "ReliableMessageReceived";
    NetEventType[NetEventType["ServerInitialized"] = 3] = "ServerInitialized";
    NetEventType[NetEventType["ServerInitFailed"] = 4] = "ServerInitFailed";
    NetEventType[NetEventType["ServerClosed"] = 5] = "ServerClosed";
    NetEventType[NetEventType["NewConnection"] = 6] = "NewConnection";
    NetEventType[NetEventType["ConnectionFailed"] = 7] = "ConnectionFailed";
    NetEventType[NetEventType["Disconnected"] = 8] = "Disconnected";
    NetEventType[NetEventType["FatalError"] = 100] = "FatalError";
    NetEventType[NetEventType["Warning"] = 101] = "Warning";
    NetEventType[NetEventType["Log"] = 102] = "Log";
    /// <summary>
    /// This value and higher are reserved for other uses. 
    /// Should never get to the user and should be filtered out.
    /// </summary>
    NetEventType[NetEventType["ReservedStart"] = 200] = "ReservedStart";
    /// <summary>
    /// Reserved.
    /// Used by protocols that forward NetworkEvents
    /// </summary>
    NetEventType[NetEventType["MetaVersion"] = 201] = "MetaVersion";
    /// <summary>
    /// Reserved.
    /// Used by protocols that forward NetworkEvents.
    /// </summary>
    NetEventType[NetEventType["MetaHeartbeat"] = 202] = "MetaHeartbeat";
})(NetEventType || (NetEventType = {}));
var NetEventDataType;
(function (NetEventDataType) {
    NetEventDataType[NetEventDataType["Null"] = 0] = "Null";
    NetEventDataType[NetEventDataType["ByteArray"] = 1] = "ByteArray";
    NetEventDataType[NetEventDataType["UTF16String"] = 2] = "UTF16String";
})(NetEventDataType || (NetEventDataType = {}));
var NetworkEvent = /** @class */ (function () {
    function NetworkEvent(t, conId, data) {
        this.type = t;
        this.connectionId = conId;
        this.data = data;
    }
    Object.defineProperty(NetworkEvent.prototype, "RawData", {
        get: function () {
            return this.data;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "MessageData", {
        get: function () {
            if (typeof this.data != "string")
                return this.data;
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "Info", {
        get: function () {
            if (typeof this.data == "string")
                return this.data;
            return null;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "Type", {
        get: function () {
            return this.type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NetworkEvent.prototype, "ConnectionId", {
        get: function () {
            return this.connectionId;
        },
        enumerable: true,
        configurable: true
    });
    //for debugging only
    NetworkEvent.prototype.toString = function () {
        var output = "NetworkEvent[";
        output += "NetEventType: (";
        output += NetEventType[this.type];
        output += "), id: (";
        output += this.connectionId.id;
        output += "), Data: (";
        if (typeof this.data == "string") {
            output += this.data;
        }
        output += ")]";
        return output;
    };
    NetworkEvent.parseFromString = function (str) {
        var values = JSON.parse(str);
        var data;
        if (values.data == null) {
            data = null;
        }
        else if (typeof values.data == "string") {
            data = values.data;
        }
        else if (typeof values.data == "object") {
            //json represents the array as an object containing each index and the
            //value as string number ... improve that later
            var arrayAsObject = values.data;
            var length = 0;
            for (var prop in arrayAsObject) {
                //if (arrayAsObject.hasOwnProperty(prop)) { //shouldnt be needed
                length++;
                //}
            }
            var buffer = new Uint8Array(Object.keys(arrayAsObject).length);
            for (var i = 0; i < buffer.length; i++)
                buffer[i] = arrayAsObject[i];
            data = buffer;
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogError("network event can't be parsed: " + str);
        }
        var evt = new NetworkEvent(values.type, values.connectionId, data);
        return evt;
    };
    NetworkEvent.toString = function (evt) {
        return JSON.stringify(evt);
    };
    NetworkEvent.fromByteArray = function (arrin) {
        //old node js versions seem to not return proper Uint8Arrays but
        //buffers -> make sure it is a Uint8Array
        var arr = new Uint8Array(arrin);
        var type = arr[0]; //byte
        var dataType = arr[1]; //byte
        var id = new Int16Array(arr.buffer, arr.byteOffset + 2, 1)[0]; //short
        var data = null;
        if (dataType == NetEventDataType.ByteArray) {
            var length_1 = new Uint32Array(arr.buffer, arr.byteOffset + 4, 1)[0]; //uint
            var byteArray = new Uint8Array(arr.buffer, arr.byteOffset + 8, length_1);
            data = byteArray;
        }
        else if (dataType == NetEventDataType.UTF16String) {
            var length_2 = new Uint32Array(arr.buffer, arr.byteOffset + 4, 1)[0]; //uint
            var uint16Arr = new Uint16Array(arr.buffer, arr.byteOffset + 8, length_2);
            var str = "";
            for (var i = 0; i < uint16Arr.length; i++) {
                str += String.fromCharCode(uint16Arr[i]);
            }
            data = str;
        }
        else if (dataType == NetEventDataType.Null) {
            //message has no data
        }
        else {
            throw new Error('Message has an invalid data type flag: ' + dataType);
        }
        var conId = new ConnectionId(id);
        var result = new NetworkEvent(type, conId, data);
        return result;
    };
    NetworkEvent.toByteArray = function (evt) {
        var dataType;
        var length = 4; //4 bytes are always needed
        //getting type and length
        if (evt.data == null) {
            dataType = NetEventDataType.Null;
        }
        else if (typeof evt.data == "string") {
            dataType = NetEventDataType.UTF16String;
            var str = evt.data;
            length += str.length * 2 + 4;
        }
        else {
            dataType = NetEventDataType.ByteArray;
            var byteArray = evt.data;
            length += 4 + byteArray.length;
        }
        //creating the byte array
        var result = new Uint8Array(length);
        result[0] = evt.type;
        ;
        result[1] = dataType;
        var conIdField = new Int16Array(result.buffer, result.byteOffset + 2, 1);
        conIdField[0] = evt.connectionId.id;
        if (dataType == NetEventDataType.ByteArray) {
            var byteArray = evt.data;
            var lengthField = new Uint32Array(result.buffer, result.byteOffset + 4, 1);
            lengthField[0] = byteArray.length;
            for (var i = 0; i < byteArray.length; i++) {
                result[8 + i] = byteArray[i];
            }
        }
        else if (dataType == NetEventDataType.UTF16String) {
            var str = evt.data;
            var lengthField = new Uint32Array(result.buffer, result.byteOffset + 4, 1);
            lengthField[0] = str.length;
            var dataField = new Uint16Array(result.buffer, result.byteOffset + 8, str.length);
            for (var i = 0; i < dataField.length; i++) {
                dataField[i] = str.charCodeAt(i);
            }
        }
        return result;
    };
    return NetworkEvent;
}());

var ConnectionId = /** @class */ (function () {
    function ConnectionId(nid) {
        this.id = nid;
    }
    ConnectionId.INVALID = new ConnectionId(-1);
    return ConnectionId;
}());

//export {NetEventType, NetworkEvent, ConnectionId, INetwork, IBasicNetwork};


/***/ }),

/***/ "./src/awrtc/network/LocalNetwork.ts":
/*!*******************************************!*\
  !*** ./src/awrtc/network/LocalNetwork.ts ***!
  \*******************************************/
/*! exports provided: LocalNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalNetwork", function() { return LocalNetwork; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


/**Helper to simulate the WebsocketNetwork or WebRtcNetwork
 * within a local application without
 * any actual network components.
 *
 * This implementation might lack some features.
 */
var LocalNetwork = /** @class */ (function () {
    function LocalNetwork() {
        this.mNextNetworkId = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](1);
        this.mServerAddress = null;
        this.mEvents = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        this.mConnectionNetwork = {};
        this.mIsDisposed = false;
        this.mId = LocalNetwork.sNextId;
        LocalNetwork.sNextId++;
    }
    Object.defineProperty(LocalNetwork.prototype, "IsServer", {
        get: function () {
            return this.mServerAddress != null;
        },
        enumerable: true,
        configurable: true
    });
    LocalNetwork.prototype.StartServer = function (serverAddress) {
        if (serverAddress === void 0) { serverAddress = null; }
        if (serverAddress == null)
            serverAddress = "" + this.mId;
        if (serverAddress in LocalNetwork.mServers) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, serverAddress);
            return;
        }
        LocalNetwork.mServers[serverAddress] = this;
        this.mServerAddress = serverAddress;
        this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, serverAddress);
    };
    LocalNetwork.prototype.StopServer = function () {
        if (this.IsServer) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, this.mServerAddress);
            delete LocalNetwork.mServers[this.mServerAddress];
            this.mServerAddress = null;
        }
    };
    LocalNetwork.prototype.Connect = function (address) {
        var connectionId = this.NextConnectionId();
        var sucessful = false;
        if (address in LocalNetwork.mServers) {
            var server = LocalNetwork.mServers[address];
            if (server != null) {
                server.ConnectClient(this);
                //add the server as local connection
                this.mConnectionNetwork[connectionId.id] = LocalNetwork.mServers[address];
                this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, connectionId, null);
                sucessful = true;
            }
        }
        if (sucessful == false) {
            console.log("!!!herehere connect..");
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed, connectionId, "Couldn't connect to the given server with id " + address);
        }
        return connectionId;
    };
    LocalNetwork.prototype.Shutdown = function () {
        for (var id in this.mConnectionNetwork) //can be changed while looping?
         {
            this.Disconnect(new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](+id));
        }
        //this.mConnectionNetwork.Clear();
        this.StopServer();
    };
    LocalNetwork.prototype.Dispose = function () {
        if (this.mIsDisposed == false) {
            this.Shutdown();
        }
    };
    LocalNetwork.prototype.SendData = function (userId, data, reliable) {
        if (userId.id in this.mConnectionNetwork) {
            var net = this.mConnectionNetwork[userId.id];
            net.ReceiveData(this, data, reliable);
            return true;
        }
        return false;
    };
    LocalNetwork.prototype.Update = function () {
        //work around for the GarbageCollection bug
        //usually weak references are removed during garbage collection but that
        //fails sometimes as others weak references get null to even though
        //the objects still exist!
        this.CleanupWreakReferences();
    };
    LocalNetwork.prototype.Dequeue = function () {
        return this.mEvents.Dequeue();
    };
    LocalNetwork.prototype.Peek = function () {
        return this.mEvents.Peek();
    };
    LocalNetwork.prototype.Flush = function () {
    };
    LocalNetwork.prototype.Disconnect = function (id) {
        if (id.id in this.mConnectionNetwork) {
            var other = this.mConnectionNetwork[id.id];
            if (other != null) {
                other.InternalDisconnectNetwork(this);
                this.InternalDisconnect(id);
            }
            else {
                //this is suppose to never happen but it does
                //if a server is destroyed by the garbage collector the client
                //weak reference appears to be NULL even though it still exists
                //bug?
                this.CleanupWreakReferences();
            }
        }
    };
    LocalNetwork.prototype.FindConnectionId = function (network) {
        for (var kvp in this.mConnectionNetwork) {
            var network_1 = this.mConnectionNetwork[kvp];
            if (network_1 != null) {
                return new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](+kvp);
            }
        }
        return _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID;
    };
    LocalNetwork.prototype.NextConnectionId = function () {
        var res = this.mNextNetworkId;
        this.mNextNetworkId = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](res.id + 1);
        return res;
    };
    LocalNetwork.prototype.ConnectClient = function (client) {
        //if (this.IsServer == false)
        //    throw new InvalidOperationException();
        var nextId = this.NextConnectionId();
        //server side only
        this.mConnectionNetwork[nextId.id] = client;
        this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, nextId, null);
    };
    LocalNetwork.prototype.Enqueue = function (type, id, data) {
        var ev = new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](type, id, data);
        this.mEvents.Enqueue(ev);
    };
    LocalNetwork.prototype.ReceiveData = function (network, data, reliable) {
        var userId = this.FindConnectionId(network);
        var buffer = new Uint8Array(data.length);
        for (var i = 0; i < buffer.length; i++) {
            buffer[i] = data[i];
        }
        var type = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].UnreliableMessageReceived;
        if (reliable)
            type = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived;
        this.Enqueue(type, userId, buffer);
    };
    LocalNetwork.prototype.InternalDisconnect = function (id) {
        if (id.id in this.mConnectionNetwork) {
            this.Enqueue(_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, id, null);
            delete this.mConnectionNetwork[id.id];
        }
    };
    LocalNetwork.prototype.InternalDisconnectNetwork = function (ln) {
        //if it can't be found it will return invalid which is ignored in internal disconnect
        this.InternalDisconnect(this.FindConnectionId(ln));
    };
    LocalNetwork.prototype.CleanupWreakReferences = function () {
        //foreach(var kvp in mConnectionNetwork.Keys.ToList())
        //{
        //    var val = mConnectionNetwork[kvp];
        //    if (val.Get() == null) {
        //        InternalDisconnect(kvp);
        //    }
        //}
    };
    LocalNetwork.sNextId = 1;
    LocalNetwork.mServers = {};
    return LocalNetwork;
}());



/***/ }),

/***/ "./src/awrtc/network/WebRtcNetwork.ts":
/*!********************************************!*\
  !*** ./src/awrtc/network/WebRtcNetwork.ts ***!
  \********************************************/
/*! exports provided: WebRtcNetworkServerState, WebRtcNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkServerState", function() { return WebRtcNetworkServerState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetwork", function() { return WebRtcNetwork; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//import {ConnectionId, NetworkEvent, NetEventType, IBasicNetwork} from './INetwork'


var WebRtcNetworkServerState;
(function (WebRtcNetworkServerState) {
    WebRtcNetworkServerState[WebRtcNetworkServerState["Invalid"] = 0] = "Invalid";
    WebRtcNetworkServerState[WebRtcNetworkServerState["Offline"] = 1] = "Offline";
    WebRtcNetworkServerState[WebRtcNetworkServerState["Starting"] = 2] = "Starting";
    WebRtcNetworkServerState[WebRtcNetworkServerState["Online"] = 3] = "Online";
})(WebRtcNetworkServerState || (WebRtcNetworkServerState = {}));
/// <summary>
/// Native version of WebRtc
///
/// Make sure to use Shutdown before unity quits! (unity will probably get stuck without it)
///
///
/// </summary>
var WebRtcNetwork = /** @class */ (function () {
    //public
    function WebRtcNetwork(signalingConfig, lRtcConfig) {
        this.mTimeout = 60000;
        this.mInSignaling = {};
        this.mNextId = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](1);
        this.mSignaling = null;
        this.mEvents = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        this.mIdToConnection = {};
        //must be the same as the hashmap and later returned read only (avoids copies)
        this.mConnectionIds = new Array();
        this.mServerState = WebRtcNetworkServerState.Offline;
        this.mIsDisposed = false;
        this.mSignaling = signalingConfig;
        this.mSignalingNetwork = this.mSignaling.GetNetwork();
        this.mRtcConfig = lRtcConfig;
    }
    Object.defineProperty(WebRtcNetwork.prototype, "IdToConnection", {
        get: function () {
            return this.mIdToConnection;
        },
        enumerable: true,
        configurable: true
    });
    //only for internal use
    WebRtcNetwork.prototype.GetConnections = function () {
        return this.mConnectionIds;
    };
    //just for debugging / testing
    WebRtcNetwork.prototype.SetLog = function (logDel) {
        this.mLogDelegate = logDel;
    };
    WebRtcNetwork.prototype.StartServer = function (address) {
        this.StartServerInternal(address);
    };
    WebRtcNetwork.prototype.StartServerInternal = function (address) {
        this.mServerState = WebRtcNetworkServerState.Starting;
        this.mSignalingNetwork.StartServer(address);
    };
    WebRtcNetwork.prototype.StopServer = function () {
        if (this.mServerState == WebRtcNetworkServerState.Starting) {
            this.mSignalingNetwork.StopServer();
            //removed. the underlaying sygnaling network should set those values
            //this.mServerState = WebRtcNetworkServerState.Offline;
            //this.mEvents.Enqueue(new NetworkEvent(NetEventType.ServerInitFailed, ConnectionId.INVALID, null));
        }
        else if (this.mServerState == WebRtcNetworkServerState.Online) {
            //dont wait for confirmation
            this.mSignalingNetwork.StopServer();
            //removed. the underlaying sygnaling network should set those values
            //this.mServerState = WebRtcNetworkServerState.Offline;
            //this.mEvents.Enqueue(new NetworkEvent(NetEventType.ServerClosed, ConnectionId.INVALID, null));
        }
    };
    WebRtcNetwork.prototype.Connect = function (address) {
        return this.AddOutgoingConnection(address);
    };
    WebRtcNetwork.prototype.Update = function () {
        this.CheckSignalingState();
        this.UpdateSignalingNetwork();
        this.UpdatePeers();
    };
    WebRtcNetwork.prototype.Dequeue = function () {
        if (this.mEvents.Count() > 0)
            return this.mEvents.Dequeue();
        return null;
    };
    WebRtcNetwork.prototype.Peek = function () {
        if (this.mEvents.Count() > 0)
            return this.mEvents.Peek();
        return null;
    };
    WebRtcNetwork.prototype.Flush = function () {
        this.mSignalingNetwork.Flush();
    };
    WebRtcNetwork.prototype.SendData = function (id, data /*, offset : number, length : number*/, reliable) {
        if (id == null || data == null || data.length == 0)
            return;
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            return peer.SendData(data, /* offset, length,*/ reliable);
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("unknown connection id");
            return false;
        }
    };
    WebRtcNetwork.prototype.GetBufferedAmount = function (id, reliable) {
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            return peer.GetBufferedAmount(reliable);
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("unknown connection id");
            return -1;
        }
    };
    WebRtcNetwork.prototype.Disconnect = function (id) {
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            this.HandleDisconnect(id);
        }
    };
    WebRtcNetwork.prototype.Shutdown = function () {
        for (var _i = 0, _a = this.mConnectionIds; _i < _a.length; _i++) {
            var id = _a[_i];
            this.Disconnect(id);
        }
        this.StopServer();
        this.mSignalingNetwork.Shutdown();
    };
    WebRtcNetwork.prototype.DisposeInternal = function () {
        if (this.mIsDisposed == false) {
            this.Shutdown();
            this.mIsDisposed = true;
        }
    };
    WebRtcNetwork.prototype.Dispose = function () {
        this.DisposeInternal();
    };
    //protected
    WebRtcNetwork.prototype.CreatePeer = function (peerId, rtcConfig) {
        var peer = new _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcDataPeer"](peerId, rtcConfig);
        return peer;
    };
    //private
    WebRtcNetwork.prototype.CheckSignalingState = function () {
        var connected = new Array();
        var failed = new Array();
        //update the signaling channels
        for (var key in this.mInSignaling) {
            var peer = this.mInSignaling[key];
            peer.Update();
            var timeAlive = peer.SignalingInfo.GetCreationTimeMs();
            var msg = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Output"]();
            while (peer.DequeueSignalingMessage(msg)) {
                var buffer = this.StringToBuffer(msg.val);
                this.mSignalingNetwork.SendData(new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](+key), buffer, true);
            }
            if (peer.GetState() == _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"].Connected) {
                connected.push(peer.SignalingInfo.ConnectionId);
            }
            else if (peer.GetState() == _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"].SignalingFailed || timeAlive > this.mTimeout) {
                failed.push(peer.SignalingInfo.ConnectionId);
            }
        }
        for (var _i = 0, connected_1 = connected; _i < connected_1.length; _i++) {
            var v = connected_1[_i];
            this.ConnectionEstablished(v);
        }
        for (var _a = 0, failed_1 = failed; _a < failed_1.length; _a++) {
            var v = failed_1[_a];
            this.SignalingFailed(v);
        }
    };
    WebRtcNetwork.prototype.UpdateSignalingNetwork = function () {
        //update the signaling system
        this.mSignalingNetwork.Update();
        var evt;
        while ((evt = this.mSignalingNetwork.Dequeue()) != null) {
            if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized) {
                this.mServerState = WebRtcNetworkServerState.Online;
                this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, evt.RawData));
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed) {
                this.mServerState = WebRtcNetworkServerState.Offline;
                this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, evt.RawData));
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed) {
                this.mServerState = WebRtcNetworkServerState.Offline;
                this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, evt.RawData));
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection) {
                //check if new incoming connection or an outgoing was established
                var peer = this.mInSignaling[evt.ConnectionId.id];
                if (peer) {
                    peer.StartSignaling();
                }
                else {
                    this.AddIncomingConnection(evt.ConnectionId);
                }
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed) {
                //Outgoing connection failed
                this.SignalingFailed(evt.ConnectionId);
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected) {
                var peer = this.mInSignaling[evt.ConnectionId.id];
                if (peer) {
                    peer.SignalingInfo.SignalingDisconnected();
                }
                //if signaling was completed this isn't a problem
                //SignalingDisconnected(evt.ConnectionId);
                //do nothing. either webrtc has enough information to connect already
                //or it will wait forever for the information -> after 30 sec we give up
            }
            else if (evt.Type == _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived) {
                var peer = this.mInSignaling[evt.ConnectionId.id];
                if (peer) {
                    var msg = this.BufferToString(evt.MessageData);
                    peer.AddSignalingMessage(msg);
                }
                else {
                    _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogWarning("Signaling message from unknown connection received");
                }
            }
        }
    };
    WebRtcNetwork.prototype.UpdatePeers = function () {
        //every peer has a queue storing incoming messages to avoid multi threading problems -> handle it now
        var disconnected = new Array();
        for (var key in this.mIdToConnection) {
            var peer = this.mIdToConnection[key];
            peer.Update();
            var ev = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Output"]();
            while (peer.DequeueEvent(/*out*/ ev)) {
                this.mEvents.Enqueue(ev.val);
            }
            if (peer.GetState() == _index__WEBPACK_IMPORTED_MODULE_0__["WebRtcPeerState"].Closed) {
                disconnected.push(peer.ConnectionId);
            }
        }
        for (var _i = 0, disconnected_1 = disconnected; _i < disconnected_1.length; _i++) {
            var key_1 = disconnected_1[_i];
            this.HandleDisconnect(key_1);
        }
    };
    WebRtcNetwork.prototype.AddOutgoingConnection = function (address) {
        var signalingConId = this.mSignalingNetwork.Connect(address);
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("new outgoing connection");
        var info = new _index__WEBPACK_IMPORTED_MODULE_0__["SignalingInfo"](signalingConId, false, Date.now());
        var peer = this.CreatePeer(this.NextConnectionId(), this.mRtcConfig);
        peer.SetSignalingInfo(info);
        this.mInSignaling[signalingConId.id] = peer;
        return peer.ConnectionId;
    };
    WebRtcNetwork.prototype.AddIncomingConnection = function (signalingConId) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("new incoming connection");
        var info = new _index__WEBPACK_IMPORTED_MODULE_0__["SignalingInfo"](signalingConId, true, Date.now());
        var peer = this.CreatePeer(this.NextConnectionId(), this.mRtcConfig);
        peer.SetSignalingInfo(info);
        this.mInSignaling[signalingConId.id] = peer;
        //passive way of starting signaling -> send out random number. if the other one does the same
        //the one with the highest number starts signaling
        peer.NegotiateSignaling();
        return peer.ConnectionId;
    };
    WebRtcNetwork.prototype.ConnectionEstablished = function (signalingConId) {
        var peer = this.mInSignaling[signalingConId.id];
        delete this.mInSignaling[signalingConId.id];
        this.mSignalingNetwork.Disconnect(signalingConId);
        this.mConnectionIds.push(peer.ConnectionId);
        this.mIdToConnection[peer.ConnectionId.id] = peer;
        this.mEvents.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, peer.ConnectionId, null));
    };
    WebRtcNetwork.prototype.SignalingFailed = function (signalingConId) {
        var peer = this.mInSignaling[signalingConId.id];
        // if (peer) {
        //     console.log("!!!herehere signalingfailed..");
        //     //connection was still believed to be in signaling -> notify the user of the event
        //     delete this.mInSignaling[signalingConId.id];
        //     this.mEvents.Enqueue(new NetworkEvent(NetEventType.ConnectionFailed, peer.ConnectionId, null));
        //     if (peer.SignalingInfo.IsSignalingConnected()) {
        //         this.mSignalingNetwork.Disconnect(signalingConId);
        //     }
        //     peer.Dispose();
        // }
    };
    WebRtcNetwork.prototype.HandleDisconnect = function (id) {
        var peer = this.mIdToConnection[id.id];
        if (peer) {
            peer.Dispose();
        }
        //??? this looks buggy. the connection id could be a reference with the same id and would not be recognized
        var index = this.mConnectionIds.indexOf(id);
        if (index != -1) {
            this.mConnectionIds.splice(index, 1);
        }
        delete this.mIdToConnection[id.id];
        var ev = new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, id, null);
        this.mEvents.Enqueue(ev);
    };
    WebRtcNetwork.prototype.NextConnectionId = function () {
        var id = new _index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](this.mNextId.id);
        this.mNextId.id++;
        return id;
    };
    WebRtcNetwork.prototype.StringToBuffer = function (str) {
        var buf = new ArrayBuffer(str.length * 2);
        var bufView = new Uint16Array(buf);
        for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i);
        }
        var result = new Uint8Array(buf);
        return result;
    };
    WebRtcNetwork.prototype.BufferToString = function (buffer) {
        var arr = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
        return String.fromCharCode.apply(null, arr);
    };
    return WebRtcNetwork;
}());



/***/ }),

/***/ "./src/awrtc/network/WebRtcPeer.ts":
/*!*****************************************!*\
  !*** ./src/awrtc/network/WebRtcPeer.ts ***!
  \*****************************************/
/*! exports provided: SignalingConfig, SignalingInfo, WebRtcPeerState, WebRtcInternalState, AWebRtcPeer, WebRtcDataPeer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignalingConfig", function() { return SignalingConfig; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "SignalingInfo", function() { return SignalingInfo; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcPeerState", function() { return WebRtcPeerState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcInternalState", function() { return WebRtcInternalState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AWebRtcPeer", function() { return AWebRtcPeer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcDataPeer", function() { return WebRtcDataPeer; });
/* harmony import */ var _index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var SignalingConfig = /** @class */ (function () {
    function SignalingConfig(network) {
        this.mNetwork = network;
    }
    SignalingConfig.prototype.GetNetwork = function () {
        return this.mNetwork;
    };
    return SignalingConfig;
}());

var SignalingInfo = /** @class */ (function () {
    function SignalingInfo(id, isIncoming, timeStamp) {
        this.mConnectionId = id;
        this.mIsIncoming = isIncoming;
        this.mCreationTime = timeStamp;
        this.mSignalingConnected = true;
    }
    SignalingInfo.prototype.IsSignalingConnected = function () {
        return this.mSignalingConnected;
    };
    Object.defineProperty(SignalingInfo.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    SignalingInfo.prototype.IsIncoming = function () {
        return this.mIsIncoming;
    };
    SignalingInfo.prototype.GetCreationTimeMs = function () {
        return Date.now() - this.mCreationTime;
    };
    SignalingInfo.prototype.SignalingDisconnected = function () {
        this.mSignalingConnected = false;
    };
    return SignalingInfo;
}());

var WebRtcPeerState;
(function (WebRtcPeerState) {
    WebRtcPeerState[WebRtcPeerState["Invalid"] = 0] = "Invalid";
    WebRtcPeerState[WebRtcPeerState["Created"] = 1] = "Created";
    WebRtcPeerState[WebRtcPeerState["Signaling"] = 2] = "Signaling";
    WebRtcPeerState[WebRtcPeerState["SignalingFailed"] = 3] = "SignalingFailed";
    WebRtcPeerState[WebRtcPeerState["Connected"] = 4] = "Connected";
    WebRtcPeerState[WebRtcPeerState["Closing"] = 5] = "Closing";
    WebRtcPeerState[WebRtcPeerState["Closed"] = 6] = "Closed"; //either Closed call finished or closed remotely or Cleanup/Dispose finished -> peer connection is destroyed and all resources are released
})(WebRtcPeerState || (WebRtcPeerState = {}));
var WebRtcInternalState;
(function (WebRtcInternalState) {
    WebRtcInternalState[WebRtcInternalState["None"] = 0] = "None";
    WebRtcInternalState[WebRtcInternalState["Signaling"] = 1] = "Signaling";
    WebRtcInternalState[WebRtcInternalState["SignalingFailed"] = 2] = "SignalingFailed";
    WebRtcInternalState[WebRtcInternalState["Connected"] = 3] = "Connected";
    WebRtcInternalState[WebRtcInternalState["Closed"] = 4] = "Closed"; //at least one channel was closed
})(WebRtcInternalState || (WebRtcInternalState = {}));
var AWebRtcPeer = /** @class */ (function () {
    function AWebRtcPeer(rtcConfig) {
        this.mState = WebRtcPeerState.Invalid;
        //only written during webrtc callbacks
        this.mRtcInternalState = WebRtcInternalState.None;
        this.mIncomingSignalingQueue = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        this.mOutgoingSignalingQueue = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        //Used to negotiate who starts the signaling if 2 peers listening
        //at the same time
        this.mDidSendRandomNumber = false;
        this.mRandomNumerSent = 0;
        this.mOfferOptions = { "offerToReceiveAudio": false, "offerToReceiveVideo": false };
        this.SetupPeer(rtcConfig);
        //remove this. it will trigger this call before the subclasses
        //are initialized
        this.OnSetup();
        this.mState = WebRtcPeerState.Created;
    }
    AWebRtcPeer.prototype.GetState = function () {
        return this.mState;
    };
    AWebRtcPeer.prototype.SetupPeer = function (rtcConfig) {
        var _this = this;
        this.mPeer = new RTCPeerConnection(rtcConfig);
        this.mPeer.onicecandidate = function (ev) { _this.OnIceCandidate(ev); };
        this.mPeer.oniceconnectionstatechange = function (ev) { _this.OnIceConnectionChange(); };
        this.mPeer.onnegotiationneeded = function (ev) { _this.OnRenegotiationNeeded(); };
        this.mPeer.onsignalingstatechange = function (ev) { _this.OnSignalingChange(); };
    };
    AWebRtcPeer.prototype.DisposeInternal = function () {
        this.Cleanup();
    };
    AWebRtcPeer.prototype.Dispose = function () {
        if (this.mPeer != null) {
            this.DisposeInternal();
        }
    };
    AWebRtcPeer.prototype.Cleanup = function () {
        //closing webrtc could cause old events to flush out -> make sure we don't call cleanup
        //recursively
        if (this.mState == WebRtcPeerState.Closed || this.mState == WebRtcPeerState.Closing) {
            return;
        }
        this.mState = WebRtcPeerState.Closing;
        this.OnCleanup();
        if (this.mPeer != null)
            this.mPeer.close();
        //js version still receives callbacks after this. would make it
        //impossible to get the state
        //this.mReliableDataChannel = null;
        //this.mUnreliableDataChannel = null;
        //this.mPeer = null;
        this.mState = WebRtcPeerState.Closed;
    };
    AWebRtcPeer.prototype.Update = function () {
        if (this.mState != WebRtcPeerState.Closed && this.mState != WebRtcPeerState.Closing && this.mState != WebRtcPeerState.SignalingFailed)
            this.UpdateState();
        if (this.mState == WebRtcPeerState.Signaling || this.mState == WebRtcPeerState.Created)
            this.HandleIncomingSignaling();
    };
    AWebRtcPeer.prototype.UpdateState = function () {
        //will only be entered if the current state isn't already one of the ending states (closed, closing, signalingfailed)
        if (this.mRtcInternalState == WebRtcInternalState.Closed) {
            //if webrtc switched to the closed state -> make sure everything is destroyed.
            //webrtc closed the connection. update internal state + destroy the references
            //to webrtc
            this.Cleanup();
            //mState will be Closed now as well
        }
        else if (this.mRtcInternalState == WebRtcInternalState.SignalingFailed) {
            //if webrtc switched to a state indicating the signaling process failed ->  set the whole state to failed
            //this step will be ignored if the peers are destroyed already to not jump back from closed state to failed
            this.mState = WebRtcPeerState.SignalingFailed;
        }
        else if (this.mRtcInternalState == WebRtcInternalState.Connected) {
            this.mState = WebRtcPeerState.Connected;
        }
    };
    AWebRtcPeer.prototype.HandleIncomingSignaling = function () {
        //handle the incoming messages all at once
        while (this.mIncomingSignalingQueue.Count() > 0) {
            var msgString = this.mIncomingSignalingQueue.Dequeue();
            var randomNumber = _Helper__WEBPACK_IMPORTED_MODULE_1__["Helper"].tryParseInt(msgString);
            if (randomNumber != null) {
                //was a random number for signaling negotiation
                //if this peer uses negotiation as well then
                //this would be true
                if (this.mDidSendRandomNumber) {
                    //no peer is set to start signaling -> the one with the bigger number starts
                    if (randomNumber < this.mRandomNumerSent) {
                        //own diced number was bigger -> start signaling
                        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Signaling negotiation complete. Starting signaling.");
                        this.StartSignaling();
                    }
                    else if (randomNumber == this.mRandomNumerSent) {
                        //same numbers. restart the process
                        this.NegotiateSignaling();
                    }
                    else {
                        //wait for other peer to start signaling
                        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Signaling negotiation complete. Waiting for signaling.");
                    }
                }
                else {
                    //ignore. this peer starts signaling automatically and doesn't use this
                    //negotiation
                }
            }
            else {
                //must be a webrtc signaling message using default json formatting
                var msg = JSON.parse(msgString);
                if (msg.sdp) {
                    var sdp = new RTCSessionDescription(msg);
                    if (sdp.type == 'offer') {
                        this.CreateAnswer(sdp);
                        //setTimeout(() => {  }, 5000);
                    }
                    else {
                        //setTimeout(() => { }, 5000);
                        this.RecAnswer(sdp);
                    }
                }
                else {
                    var ice = new RTCIceCandidate(msg);
                    if (ice != null) {
                        var promise = this.mPeer.addIceCandidate(ice);
                        promise.then(function () { });
                        promise.catch(function (error) { _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error); });
                    }
                }
            }
        }
    };
    AWebRtcPeer.prototype.AddSignalingMessage = function (msg) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("incoming Signaling message " + msg);
        this.mIncomingSignalingQueue.Enqueue(msg);
    };
    AWebRtcPeer.prototype.DequeueSignalingMessage = function (/*out*/ msg) {
        //lock might be not the best way to deal with this
        //lock(mOutgoingSignalingQueue)
        {
            if (this.mOutgoingSignalingQueue.Count() > 0) {
                msg.val = this.mOutgoingSignalingQueue.Dequeue();
                return true;
            }
            else {
                msg.val = null;
                return false;
            }
        }
    };
    AWebRtcPeer.prototype.EnqueueOutgoing = function (msg) {
        //lock(mOutgoingSignalingQueue)
        {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("Outgoing Signaling message " + msg);
            this.mOutgoingSignalingQueue.Enqueue(msg);
        }
    };
    AWebRtcPeer.prototype.StartSignaling = function () {
        this.OnStartSignaling();
        this.CreateOffer();
    };
    AWebRtcPeer.prototype.NegotiateSignaling = function () {
        var nb = _Helper__WEBPACK_IMPORTED_MODULE_1__["Random"].getRandomInt(0, 2147483647);
        this.mRandomNumerSent = nb;
        this.mDidSendRandomNumber = true;
        this.EnqueueOutgoing("" + nb);
    };
    AWebRtcPeer.prototype.CreateOffer = function () {
        var _this = this;
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("CreateOffer");
        var createOfferPromise = this.mPeer.createOffer(this.mOfferOptions);
        createOfferPromise.then(function (desc) {
            var msg = JSON.stringify(desc);
            var setDescPromise = _this.mPeer.setLocalDescription(desc);
            setDescPromise.then(function () {
                _this.RtcSetSignalingStarted();
                _this.EnqueueOutgoing(msg);
            });
            setDescPromise.catch(function (error) {
                _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
                _this.RtcSetSignalingFailed();
            });
        });
        createOfferPromise.catch(function (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
            _this.RtcSetSignalingFailed();
        });
    };
    AWebRtcPeer.prototype.CreateAnswer = function (offer) {
        var _this = this;
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("CreateAnswer");
        var remoteDescPromise = this.mPeer.setRemoteDescription(offer);
        remoteDescPromise.then(function () {
            var createAnswerPromise = _this.mPeer.createAnswer();
            createAnswerPromise.then(function (desc) {
                var msg = JSON.stringify(desc);
                var localDescPromise = _this.mPeer.setLocalDescription(desc);
                localDescPromise.then(function () {
                    _this.RtcSetSignalingStarted();
                    _this.EnqueueOutgoing(msg);
                });
                localDescPromise.catch(function (error) {
                    _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
                    _this.RtcSetSignalingFailed();
                });
            });
            createAnswerPromise.catch(function (error) {
                _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
                _this.RtcSetSignalingFailed();
            });
        });
        remoteDescPromise.catch(function (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
            _this.RtcSetSignalingFailed();
        });
    };
    AWebRtcPeer.prototype.RecAnswer = function (answer) {
        var _this = this;
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("RecAnswer");
        var remoteDescPromise = this.mPeer.setRemoteDescription(answer);
        remoteDescPromise.then(function () {
            //all done
        });
        remoteDescPromise.catch(function (error) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(error);
            _this.RtcSetSignalingFailed();
        });
    };
    AWebRtcPeer.prototype.RtcSetSignalingStarted = function () {
        if (this.mRtcInternalState == WebRtcInternalState.None) {
            this.mRtcInternalState = WebRtcInternalState.Signaling;
        }
    };
    AWebRtcPeer.prototype.RtcSetSignalingFailed = function () {
        this.mRtcInternalState = WebRtcInternalState.SignalingFailed;
    };
    AWebRtcPeer.prototype.RtcSetConnected = function () {
        if (this.mRtcInternalState == WebRtcInternalState.Signaling)
            this.mRtcInternalState = WebRtcInternalState.Connected;
    };
    AWebRtcPeer.prototype.RtcSetClosed = function () {
        if (this.mRtcInternalState == WebRtcInternalState.Connected)
            this.mRtcInternalState = WebRtcInternalState.Closed;
    };
    AWebRtcPeer.prototype.OnIceCandidate = function (ev) {
        if (ev && ev.candidate) {
            var candidate = ev.candidate;
            var msg = JSON.stringify(candidate);
            this.EnqueueOutgoing(msg);
        }
    };
    AWebRtcPeer.prototype.OnIceConnectionChange = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log(this.mPeer.iceConnectionState);
        if (this.mPeer.iceConnectionState == "failed") {
            if (this.mState == WebRtcPeerState.Signaling) {
                this.RtcSetSignalingFailed();
            }
            else if (this.mState == WebRtcPeerState.Connected) {
                this.RtcSetClosed();
            }
        }
    };
    AWebRtcPeer.prototype.OnIceGatheringChange = function ( /*new_state: RTCIceGatheringState*/) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log(this.mPeer.iceGatheringState);
    };
    AWebRtcPeer.prototype.OnRenegotiationNeeded = function () { };
    AWebRtcPeer.prototype.OnSignalingChange = function ( /*new_state: RTCSignalingState*/) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log(this.mPeer.signalingState);
        if (this.mPeer.signalingState == "closed") {
            this.RtcSetClosed();
        }
    };
    return AWebRtcPeer;
}());

var WebRtcDataPeer = /** @class */ (function (_super) {
    __extends(WebRtcDataPeer, _super);
    function WebRtcDataPeer(id, rtcConfig) {
        var _this = _super.call(this, rtcConfig) || this;
        _this.mInfo = null;
        _this.mEvents = new _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]();
        _this.mReliableDataChannelReady = false;
        _this.mUnreliableDataChannelReady = false;
        _this.mConnectionId = id;
        return _this;
    }
    Object.defineProperty(WebRtcDataPeer.prototype, "ConnectionId", {
        get: function () {
            return this.mConnectionId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebRtcDataPeer.prototype, "SignalingInfo", {
        get: function () {
            return this.mInfo;
        },
        enumerable: true,
        configurable: true
    });
    WebRtcDataPeer.prototype.SetSignalingInfo = function (info) {
        this.mInfo = info;
    };
    WebRtcDataPeer.prototype.OnSetup = function () {
        // this.mPeer.ondatachannel = (ev: Event) => { this.OnDataChannel((ev as any).channel); };
    };
    WebRtcDataPeer.prototype.OnStartSignaling = function () {
        // let configReliable: RTCDataChannelInit = {} as RTCDataChannelInit;
        // this.mReliableDataChannel = this.mPeer.createDataChannel(WebRtcDataPeer.sLabelReliable, configReliable);
        // this.RegisterObserverReliable();
        // let configUnreliable: RTCDataChannelInit = {} as RTCDataChannelInit;
        // configUnreliable.maxRetransmits = 0;
        // configUnreliable.ordered = false;
        // this.mUnreliableDataChannel = this.mPeer.createDataChannel(WebRtcDataPeer.sLabelUnreliable, configUnreliable);
        // this.RegisterObserverUnreliable();
    };
    WebRtcDataPeer.prototype.OnCleanup = function () {
        if (this.mReliableDataChannel != null)
            this.mReliableDataChannel.close();
        if (this.mUnreliableDataChannel != null)
            this.mUnreliableDataChannel.close();
        //dont set to null. handlers will be called later
    };
    WebRtcDataPeer.prototype.RegisterObserverReliable = function () {
        var _this = this;
        this.mReliableDataChannel.onmessage = function (event) { _this.ReliableDataChannel_OnMessage(event); };
        this.mReliableDataChannel.onopen = function (event) { _this.ReliableDataChannel_OnOpen(); };
        this.mReliableDataChannel.onclose = function (event) { _this.ReliableDataChannel_OnClose(); };
        this.mReliableDataChannel.onerror = function (event) { _this.ReliableDataChannel_OnError(""); }; //should the event just be a string?
    };
    WebRtcDataPeer.prototype.RegisterObserverUnreliable = function () {
        var _this = this;
        this.mUnreliableDataChannel.onmessage = function (event) { _this.UnreliableDataChannel_OnMessage(event); };
        this.mUnreliableDataChannel.onopen = function (event) { _this.UnreliableDataChannel_OnOpen(); };
        this.mUnreliableDataChannel.onclose = function (event) { _this.UnreliableDataChannel_OnClose(); };
        this.mUnreliableDataChannel.onerror = function (event) { _this.UnreliableDataChannel_OnError(""); }; //should the event just be a string?
    };
    WebRtcDataPeer.prototype.SendData = function (data, /* offset : number, length : number,*/ reliable) {
        //let buffer: ArrayBufferView = data.subarray(offset, offset + length) as ArrayBufferView;
        var buffer = data;
        var MAX_SEND_BUFFER = 1024 * 1024;
        //chrome bug: If the channels is closed remotely trough disconnect
        //then the local channel can appear open but will throw an exception
        //if send is called
        var sentSuccessfully = false;
        try {
            if (reliable) {
                if (this.mReliableDataChannel.readyState === "open") {
                    //bugfix: WebRTC seems to simply close the data channel if we send
                    //too much at once. avoid this from now on by returning false
                    //if the buffer gets too full
                    if ((this.mReliableDataChannel.bufferedAmount + buffer.byteLength) < MAX_SEND_BUFFER) {
                        this.mReliableDataChannel.send(buffer);
                        sentSuccessfully = true;
                    }
                }
            }
            else {
                if (this.mUnreliableDataChannel.readyState === "open") {
                    if ((this.mUnreliableDataChannel.bufferedAmount + buffer.byteLength) < MAX_SEND_BUFFER) {
                        this.mUnreliableDataChannel.send(buffer);
                        sentSuccessfully = true;
                    }
                }
            }
        }
        catch (e) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogError("Exception while trying to send: " + e);
        }
        return sentSuccessfully;
    };
    WebRtcDataPeer.prototype.GetBufferedAmount = function (reliable) {
        var result = -1;
        try {
            if (reliable) {
                if (this.mReliableDataChannel.readyState === "open") {
                    result = this.mReliableDataChannel.bufferedAmount;
                }
            }
            else {
                if (this.mUnreliableDataChannel.readyState === "open") {
                    result = this.mUnreliableDataChannel.bufferedAmount;
                }
            }
        }
        catch (e) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LogError("Exception while trying to access GetBufferedAmount: " + e);
        }
        return result;
    };
    WebRtcDataPeer.prototype.DequeueEvent = function (/*out*/ ev) {
        //lock(mEvents)
        {
            if (this.mEvents.Count() > 0) {
                ev.val = this.mEvents.Dequeue();
                return true;
            }
        }
        return false;
    };
    WebRtcDataPeer.prototype.Enqueue = function (ev) {
        //lock(mEvents)
        {
            this.mEvents.Enqueue(ev);
        }
    };
    WebRtcDataPeer.prototype.OnDataChannel = function (data_channel) {
        var newChannel = data_channel;
        if (newChannel.label == WebRtcDataPeer.sLabelReliable) {
            this.mReliableDataChannel = newChannel;
            this.RegisterObserverReliable();
        }
        else if (newChannel.label == WebRtcDataPeer.sLabelUnreliable) {
            this.mUnreliableDataChannel = newChannel;
            this.RegisterObserverUnreliable();
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError("Datachannel with unexpected label " + newChannel.label);
        }
    };
    WebRtcDataPeer.prototype.RtcOnMessageReceived = function (event, reliable) {
        var eventType = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].UnreliableMessageReceived;
        if (reliable) {
            eventType = _index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived;
        }
        //async conversion to blob/arraybuffer here
        if (event.data instanceof ArrayBuffer) {
            var buffer = new Uint8Array(event.data);
            this.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](eventType, this.mConnectionId, buffer));
        }
        else if (event.data instanceof Blob) {
            var connectionId = this.mConnectionId;
            var fileReader = new FileReader();
            var self = this;
            fileReader.onload = function () {
                //need to use function as this pointer is needed to reference to the data
                var data = this.result;
                var buffer = new Uint8Array(data);
                self.Enqueue(new _index__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](eventType, self.mConnectionId, buffer));
            };
            fileReader.readAsArrayBuffer(event.data);
        }
        else {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError("Invalid message type. Only blob and arraybuffer supported: " + event.data);
        }
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnMessage = function (event) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("ReliableDataChannel_OnMessage ");
        this.RtcOnMessageReceived(event, true);
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnOpen = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("mReliableDataChannelReady");
        this.mReliableDataChannelReady = true;
        if (this.IsRtcConnected()) {
            this.RtcSetConnected();
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("Fully connected");
        }
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnClose = function () {
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.ReliableDataChannel_OnError = function (errorMsg) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(errorMsg);
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnMessage = function (event) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("UnreliableDataChannel_OnMessage ");
        this.RtcOnMessageReceived(event, false);
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnOpen = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("mUnreliableDataChannelReady");
        this.mUnreliableDataChannelReady = true;
        if (this.IsRtcConnected()) {
            this.RtcSetConnected();
            _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].Log("Fully connected");
        }
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnClose = function () {
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.UnreliableDataChannel_OnError = function (errorMsg) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"].LogError(errorMsg);
        this.RtcSetClosed();
    };
    WebRtcDataPeer.prototype.IsRtcConnected = function () {
        return this.mReliableDataChannelReady && this.mUnreliableDataChannelReady;
    };
    WebRtcDataPeer.sLabelReliable = "reliable";
    WebRtcDataPeer.sLabelUnreliable = "unreliable";
    return WebRtcDataPeer;
}(AWebRtcPeer));



/***/ }),

/***/ "./src/awrtc/network/WebsocketNetwork.ts":
/*!***********************************************!*\
  !*** ./src/awrtc/network/WebsocketNetwork.ts ***!
  \***********************************************/
/*! exports provided: WebsocketConnectionStatus, WebsocketServerStatus, WebsocketNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketConnectionStatus", function() { return WebsocketConnectionStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketServerStatus", function() { return WebsocketServerStatus; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketNetwork", function() { return WebsocketNetwork; });
/* harmony import */ var _INetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./INetwork */ "./src/awrtc/network/INetwork.ts");
/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var WebsocketConnectionStatus;
(function (WebsocketConnectionStatus) {
    WebsocketConnectionStatus[WebsocketConnectionStatus["Uninitialized"] = 0] = "Uninitialized";
    WebsocketConnectionStatus[WebsocketConnectionStatus["NotConnected"] = 1] = "NotConnected";
    WebsocketConnectionStatus[WebsocketConnectionStatus["Connecting"] = 2] = "Connecting";
    WebsocketConnectionStatus[WebsocketConnectionStatus["Connected"] = 3] = "Connected";
    WebsocketConnectionStatus[WebsocketConnectionStatus["Disconnecting"] = 4] = "Disconnecting"; //server will shut down, all clients disconnect, ...
})(WebsocketConnectionStatus || (WebsocketConnectionStatus = {}));
var WebsocketServerStatus;
(function (WebsocketServerStatus) {
    WebsocketServerStatus[WebsocketServerStatus["Offline"] = 0] = "Offline";
    WebsocketServerStatus[WebsocketServerStatus["Starting"] = 1] = "Starting";
    WebsocketServerStatus[WebsocketServerStatus["Online"] = 2] = "Online";
    WebsocketServerStatus[WebsocketServerStatus["ShuttingDown"] = 3] = "ShuttingDown";
})(WebsocketServerStatus || (WebsocketServerStatus = {}));
//TODO: handle errors if the socket connection failed
//+ send back failed events for connected / serverstart events that are buffered
var WebsocketNetwork = /** @class */ (function () {
    function WebsocketNetwork(url, configuration) {
        //currents status. will be updated based on update call
        this.mStatus = WebsocketConnectionStatus.Uninitialized;
        //queue to hold buffered outgoing messages
        this.mOutgoingQueue = new Array();
        //buffer for incoming messages
        this.mIncomingQueue = new Array();
        //Status of the server for incoming connections
        this.mServerStatus = WebsocketServerStatus.Offline;
        //outgoing connections (just need to be stored to allow to send out a failed message
        //if the whole signaling connection fails
        this.mConnecting = new Array();
        this.mConnections = new Array();
        //next free connection id
        this.mNextOutgoingConnectionId = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](1);
        /// <summary>
        /// Assume 1 until message received
        /// </summary>
        this.mRemoteProtocolVersion = 1;
        this.mUrl = null;
        this.mHeartbeatReceived = true;
        this.mIsDisposed = false;
        this.mUrl = url;
        this.mStatus = WebsocketConnectionStatus.NotConnected;
        this.mConfig = configuration;
        if (!this.mConfig)
            this.mConfig = new WebsocketNetwork.Configuration();
        this.mConfig.Lock();
    }
    WebsocketNetwork.prototype.getStatus = function () { return this.mStatus; };
    ;
    WebsocketNetwork.prototype.WebsocketConnect = function () {
        var _this = this;
        this.mStatus = WebsocketConnectionStatus.Connecting;
        this.mSocket = new WebSocket(this.mUrl);
        this.mSocket.binaryType = "arraybuffer";
        this.mSocket.onopen = function () { _this.OnWebsocketOnOpen(); };
        this.mSocket.onerror = function (error) { _this.OnWebsocketOnError(error); };
        this.mSocket.onmessage = function (e) { _this.OnWebsocketOnMessage(e); };
        this.mSocket.onclose = function (e) { _this.OnWebsocketOnClose(e); };
    };
    WebsocketNetwork.prototype.WebsocketCleanup = function () {
        this.mSocket.onopen = null;
        this.mSocket.onerror = null;
        this.mSocket.onmessage = null;
        this.mSocket.onclose = null;
        if (this.mSocket.readyState == this.mSocket.OPEN
            || this.mSocket.readyState == this.mSocket.CONNECTING) {
            this.mSocket.close();
        }
        this.mSocket = null;
    };
    WebsocketNetwork.prototype.EnsureServerConnection = function () {
        if (this.mStatus == WebsocketConnectionStatus.NotConnected) {
            //no server
            //no connection about to be established
            //no current connections
            //-> disconnect the server connection
            this.WebsocketConnect();
        }
    };
    WebsocketNetwork.prototype.UpdateHeartbeat = function () {
        if (this.mStatus == WebsocketConnectionStatus.Connected && this.mConfig.Heartbeat > 0) {
            var diff = Date.now() - this.mLastHeartbeat;
            if (diff > (this.mConfig.Heartbeat * 1000)) {
                //We trigger heatbeat timeouts only for protocol V2
                //protocol 1 can receive the heatbeats but
                //won't send a reply
                //(still helpful to trigger TCP ACK timeout)
                if (this.mRemoteProtocolVersion > 1
                    && this.mHeartbeatReceived == false) {
                    this.TriggerHeartbeatTimeout();
                    return;
                }
                this.mLastHeartbeat = Date.now();
                this.mHeartbeatReceived = false;
                this.SendHeartbeat();
            }
        }
    };
    WebsocketNetwork.prototype.TriggerHeartbeatTimeout = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L("Closing due to heartbeat timeout. Server didn't respond in time.", WebsocketNetwork.LOGTAG);
        this.Cleanup();
    };
    WebsocketNetwork.prototype.CheckSleep = function () {
        if (this.mStatus == WebsocketConnectionStatus.Connected
            && this.mServerStatus == WebsocketServerStatus.Offline
            && this.mConnecting.length == 0
            && this.mConnections.length == 0) {
            //no server
            //no connection about to be established
            //no current connections
            //-> disconnect the server connection
            this.Cleanup();
        }
    };
    WebsocketNetwork.prototype.OnWebsocketOnOpen = function () {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L('onWebsocketOnOpen', WebsocketNetwork.LOGTAG);
        this.mStatus = WebsocketConnectionStatus.Connected;
        this.mLastHeartbeat = Date.now();
        this.SendVersion();
    };
    WebsocketNetwork.prototype.OnWebsocketOnClose = function (event) {
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].L('Closed: ' + JSON.stringify(event), WebsocketNetwork.LOGTAG);
        if (event.code != 1000) {
            _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LE("Websocket closed with code: " + event.code + " " + event.reason);
        }
        //ignore closed event if it was caused due to a shutdown (as that means we cleaned up already)
        if (this.mStatus == WebsocketConnectionStatus.Disconnecting
            || this.mStatus == WebsocketConnectionStatus.NotConnected)
            return;
        this.Cleanup();
        this.mStatus = WebsocketConnectionStatus.NotConnected;
    };
    WebsocketNetwork.prototype.OnWebsocketOnMessage = function (event) {
        if (this.mStatus == WebsocketConnectionStatus.Disconnecting
            || this.mStatus == WebsocketConnectionStatus.NotConnected)
            return;
        //browsers will have ArrayBuffer in event.data -> change to byte array
        var msg = new Uint8Array(event.data);
        this.ParseMessage(msg);
    };
    WebsocketNetwork.prototype.OnWebsocketOnError = function (error) {
        //the error event doesn't seem to have any useful information?
        //browser is expected to call OnClose after this
        _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LE('WebSocket Error ' + error);
    };
    /// <summary>
    /// called during Disconnecting state either trough server connection failed or due to Shutdown
    ///
    /// Also used to switch to sleeping mode. In this case there connection isn't used as
    /// server and doesn't have any connections (established or connecting) thus
    /// only WebsocketCleanup is in effect.
    ///
    /// WebsocketNetwork has to be still usable after this call like a newly
    /// created connections (except with events in the message queue)
    /// </summary>
    WebsocketNetwork.prototype.Cleanup = function () {
        //check if this was done already (or we are in the process of cleanup already)
        if (this.mStatus == WebsocketConnectionStatus.Disconnecting
            || this.mStatus == WebsocketConnectionStatus.NotConnected)
            return;
        this.mStatus = WebsocketConnectionStatus.Disconnecting;
        //throw connection failed events for each connection in mConnecting
        for (var _i = 0, _a = this.mConnecting; _i < _a.length; _i++) {
            var conId = _a[_i];
            //all connection it tries to establish right now fail due to shutdown
            console.log("!!! herehere cleanup...");
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed, new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](conId), null));
        }
        this.mConnecting = new Array();
        //throw disconnect events for all NewConnection events in the outgoing queue
        //ignore messages and everything else
        for (var _b = 0, _c = this.mConnections; _b < _c.length; _b++) {
            var conId = _c[_b];
            //all connection it tries to establish right now fail due to shutdown
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](conId), null));
        }
        this.mConnections = new Array();
        if (this.mServerStatus == WebsocketServerStatus.Starting) {
            //if server was Starting -> throw failed event
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
        }
        else if (this.mServerStatus == WebsocketServerStatus.Online) {
            //if server was Online -> throw close event
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
        }
        else if (this.mServerStatus == WebsocketServerStatus.ShuttingDown) {
            //if server was ShuttingDown -> throw close event (don't think this can happen)
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
        }
        this.mServerStatus = WebsocketServerStatus.Offline;
        this.mOutgoingQueue = new Array();
        this.WebsocketCleanup();
        this.mStatus = WebsocketConnectionStatus.NotConnected;
    };
    WebsocketNetwork.prototype.EnqueueOutgoing = function (evt) {
        this.mOutgoingQueue.push(evt);
    };
    WebsocketNetwork.prototype.EnqueueIncoming = function (evt) {
        this.mIncomingQueue.push(evt);
    };
    WebsocketNetwork.prototype.TryRemoveConnecting = function (id) {
        var index = this.mConnecting.indexOf(id.id);
        if (index != -1) {
            this.mConnecting.splice(index, 1);
        }
    };
    WebsocketNetwork.prototype.TryRemoveConnection = function (id) {
        var index = this.mConnections.indexOf(id.id);
        if (index != -1) {
            this.mConnections.splice(index, 1);
        }
    };
    WebsocketNetwork.prototype.ParseMessage = function (msg) {
        if (msg.length == 0) {
        }
        else if (msg[0] == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaVersion) {
            if (msg.length > 1) {
                this.mRemoteProtocolVersion = msg[1];
            }
            else {
                _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"].LW("Received an invalid MetaVersion header without content.");
            }
        }
        else if (msg[0] == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaHeartbeat) {
            this.mHeartbeatReceived = true;
        }
        else {
            var evt = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"].fromByteArray(msg);
            this.HandleIncomingEvent(evt);
        }
    };
    WebsocketNetwork.prototype.HandleIncomingEvent = function (evt) {
        if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection) {
            //removing connecting info
            this.TryRemoveConnecting(evt.ConnectionId);
            //add connection
            this.mConnections.push(evt.ConnectionId.id);
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed) {
            //remove connecting info
            this.TryRemoveConnecting(evt.ConnectionId);
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected) {
            //remove from connections
            this.TryRemoveConnection(evt.ConnectionId);
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized) {
            this.mServerStatus = WebsocketServerStatus.Online;
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed) {
            this.mServerStatus = WebsocketServerStatus.Offline;
        }
        else if (evt.Type == _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed) {
            this.mServerStatus = WebsocketServerStatus.ShuttingDown;
            //any cleaning up to do?
            this.mServerStatus = WebsocketServerStatus.Offline;
        }
        this.EnqueueIncoming(evt);
    };
    WebsocketNetwork.prototype.HandleOutgoingEvents = function () {
        while (this.mOutgoingQueue.length > 0) {
            var evt = this.mOutgoingQueue.shift();
            this.SendNetworkEvent(evt);
        }
    };
    WebsocketNetwork.prototype.SendHeartbeat = function () {
        var msg = new Uint8Array(1);
        msg[0] = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaHeartbeat;
        this.InternalSend(msg);
    };
    WebsocketNetwork.prototype.SendVersion = function () {
        var msg = new Uint8Array(2);
        msg[0] = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].MetaVersion;
        msg[1] = WebsocketNetwork.PROTOCOL_VERSION;
        this.InternalSend(msg);
    };
    WebsocketNetwork.prototype.SendNetworkEvent = function (evt) {
        var msg = _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"].toByteArray(evt);
        this.InternalSend(msg);
    };
    WebsocketNetwork.prototype.InternalSend = function (msg) {
        this.mSocket.send(msg);
    };
    WebsocketNetwork.prototype.NextConnectionId = function () {
        var result = this.mNextOutgoingConnectionId;
        this.mNextOutgoingConnectionId = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](this.mNextOutgoingConnectionId.id + 1);
        return result;
    };
    WebsocketNetwork.prototype.GetRandomKey = function () {
        var result = "";
        for (var i = 0; i < 7; i++) {
            result += String.fromCharCode(65 + Math.round(Math.random() * 25));
        }
        return result;
    };
    //interface implementation
    WebsocketNetwork.prototype.Dequeue = function () {
        if (this.mIncomingQueue.length > 0)
            return this.mIncomingQueue.shift();
        return null;
    };
    WebsocketNetwork.prototype.Peek = function () {
        if (this.mIncomingQueue.length > 0)
            return this.mIncomingQueue[0];
        return null;
    };
    WebsocketNetwork.prototype.Update = function () {
        this.UpdateHeartbeat();
        this.CheckSleep();
    };
    WebsocketNetwork.prototype.Flush = function () {
        //ideally we buffer everything and then flush when it is connected as
        //websockets aren't suppose to be used for realtime communication anyway
        if (this.mStatus == WebsocketConnectionStatus.Connected)
            this.HandleOutgoingEvents();
    };
    WebsocketNetwork.prototype.SendData = function (id, data, /*offset: number, length: number,*/ reliable) {
        if (id == null || data == null || data.length == 0)
            return;
        var evt;
        if (reliable) {
            evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ReliableMessageReceived, id, data);
        }
        else {
            evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].UnreliableMessageReceived, id, data);
        }
        this.EnqueueOutgoing(evt);
        return true;
    };
    WebsocketNetwork.prototype.Disconnect = function (id) {
        var evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected, id, null);
        this.EnqueueOutgoing(evt);
    };
    WebsocketNetwork.prototype.Shutdown = function () {
        this.Cleanup();
        this.mStatus = WebsocketConnectionStatus.NotConnected;
    };
    WebsocketNetwork.prototype.Dispose = function () {
        if (this.mIsDisposed == false) {
            this.Shutdown();
            this.mIsDisposed = true;
        }
    };
    WebsocketNetwork.prototype.StartServer = function (address) {
        if (address == null) {
            address = "" + this.GetRandomKey();
        }
        if (this.mServerStatus == WebsocketServerStatus.Offline) {
            this.EnsureServerConnection();
            this.mServerStatus = WebsocketServerStatus.Starting;
            //TODO: address is a string but ubytearray is defined. will fail if binary
            this.EnqueueOutgoing(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, address));
        }
        else {
            this.EnqueueIncoming(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, address));
        }
    };
    WebsocketNetwork.prototype.StopServer = function () {
        this.EnqueueOutgoing(new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed, _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID, null));
    };
    WebsocketNetwork.prototype.Connect = function (address) {
        this.EnsureServerConnection();
        var newConId = this.NextConnectionId();
        this.mConnecting.push(newConId.id);
        var evt = new _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"](_INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection, newConId, address);
        this.EnqueueOutgoing(evt);
        return newConId;
    };
    WebsocketNetwork.LOGTAG = "WebsocketNetwork";
    /// <summary>
    /// Version of the protocol implemented here
    /// </summary>
    WebsocketNetwork.PROTOCOL_VERSION = 2;
    /// <summary>
    /// Minimal protocol version that is still supported.
    /// V 1 servers won't understand heartbeat and version
    /// messages but would just log an unknown message and
    /// continue normally.
    /// </summary>
    WebsocketNetwork.PROTOCOL_VERSION_MIN = 1;
    return WebsocketNetwork;
}());

(function (WebsocketNetwork) {
    var Configuration = /** @class */ (function () {
        function Configuration() {
            this.mHeartbeat = 30;
            this.mLocked = false;
        }
        Object.defineProperty(Configuration.prototype, "Heartbeat", {
            get: function () {
                return this.mHeartbeat;
            },
            set: function (value) {
                if (this.mLocked) {
                    throw new Error("Can't change configuration once used.");
                }
                this.mHeartbeat = value;
            },
            enumerable: true,
            configurable: true
        });
        Configuration.prototype.Lock = function () {
            this.mLocked = true;
        };
        return Configuration;
    }());
    WebsocketNetwork.Configuration = Configuration;
})(WebsocketNetwork || (WebsocketNetwork = {}));
//Below tests only. Move out later
function bufferToString(buffer) {
    var arr = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / 2);
    return String.fromCharCode.apply(null, arr);
}
function stringToBuffer(str) {
    var buf = new ArrayBuffer(str.length * 2);
    var bufView = new Uint16Array(buf);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    var result = new Uint8Array(buf);
    return result;
}


/***/ }),

/***/ "./src/awrtc/network/index.ts":
/*!************************************!*\
  !*** ./src/awrtc/network/index.ts ***!
  \************************************/
/*! exports provided: NetEventType, NetEventDataType, NetworkEvent, ConnectionId, Queue, List, Output, Debug, Encoder, UTF16Encoding, Encoding, Random, Helper, SLogLevel, SLog, SignalingConfig, SignalingInfo, WebRtcPeerState, WebRtcInternalState, AWebRtcPeer, WebRtcDataPeer, WebRtcNetworkServerState, WebRtcNetwork, WebsocketConnectionStatus, WebsocketServerStatus, WebsocketNetwork, LocalNetwork */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _INetwork__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./INetwork */ "./src/awrtc/network/INetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventType", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetEventDataType", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetEventDataType"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "NetworkEvent", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["NetworkEvent"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "ConnectionId", function() { return _INetwork__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"]; });

/* harmony import */ var _Helper__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Helper */ "./src/awrtc/network/Helper.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Queue", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Queue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "List", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["List"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Output", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Output"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Debug", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Debug"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoder", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Encoder"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "UTF16Encoding", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["UTF16Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Encoding", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Encoding"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Random", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Random"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "Helper", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["Helper"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLogLevel", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["SLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SLog", function() { return _Helper__WEBPACK_IMPORTED_MODULE_1__["SLog"]; });

/* harmony import */ var _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WebRtcPeer */ "./src/awrtc/network/WebRtcPeer.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingConfig", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["SignalingConfig"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "SignalingInfo", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["SignalingInfo"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcPeerState", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["WebRtcPeerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcInternalState", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["WebRtcInternalState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "AWebRtcPeer", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["AWebRtcPeer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcDataPeer", function() { return _WebRtcPeer__WEBPACK_IMPORTED_MODULE_2__["WebRtcDataPeer"]; });

/* harmony import */ var _WebRtcNetwork__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./WebRtcNetwork */ "./src/awrtc/network/WebRtcNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkServerState", function() { return _WebRtcNetwork__WEBPACK_IMPORTED_MODULE_3__["WebRtcNetworkServerState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetwork", function() { return _WebRtcNetwork__WEBPACK_IMPORTED_MODULE_3__["WebRtcNetwork"]; });

/* harmony import */ var _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./WebsocketNetwork */ "./src/awrtc/network/WebsocketNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketConnectionStatus", function() { return _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__["WebsocketConnectionStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketServerStatus", function() { return _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__["WebsocketServerStatus"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketNetwork", function() { return _WebsocketNetwork__WEBPACK_IMPORTED_MODULE_4__["WebsocketNetwork"]; });

/* harmony import */ var _LocalNetwork__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./LocalNetwork */ "./src/awrtc/network/LocalNetwork.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalNetwork", function() { return _LocalNetwork__WEBPACK_IMPORTED_MODULE_5__["LocalNetwork"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/








/***/ }),

/***/ "./src/awrtc/unity/CAPI.ts":
/*!*********************************!*\
  !*** ./src/awrtc/unity/CAPI.ts ***!
  \*********************************/
/*! exports provided: CAPI_InitAsync, CAPI_PollInitState, CAPI_SLog_SetLogLevel, CAPI_WebRtcNetwork_IsAvailable, CAPI_WebRtcNetwork_IsBrowserSupported, CAPI_WebRtcNetwork_Create, CAPI_WebRtcNetwork_Release, CAPI_WebRtcNetwork_Connect, CAPI_WebRtcNetwork_StartServer, CAPI_WebRtcNetwork_StopServer, CAPI_WebRtcNetwork_Disconnect, CAPI_WebRtcNetwork_Shutdown, CAPI_WebRtcNetwork_Update, CAPI_WebRtcNetwork_Flush, CAPI_WebRtcNetwork_SendData, CAPI_WebRtcNetwork_SendDataEm, CAPI_WebRtcNetwork_GetBufferedAmount, CAPI_WebRtcNetwork_Dequeue, CAPI_WebRtcNetwork_Peek, CAPI_WebRtcNetwork_PeekEventDataLength, CAPI_WebRtcNetwork_CheckEventLength, CAPI_WebRtcNetwork_EventDataToUint8Array, CAPI_WebRtcNetwork_DequeueEm, CAPI_WebRtcNetwork_PeekEm, CAPI_MediaNetwork_IsAvailable, CAPI_MediaNetwork_HasUserMedia, CAPI_MediaNetwork_Create, CAPI_MediaNetwork_Configure, CAPI_MediaNetwork_GetConfigurationState, CAPI_MediaNetwork_GetConfigurationError, CAPI_MediaNetwork_ResetConfiguration, CAPI_MediaNetwork_TryGetFrame, CAPI_MediaNetwork_TryGetFrameDataLength, CAPI_MediaNetwork_SetVolume, CAPI_MediaNetwork_HasAudioTrack, CAPI_MediaNetwork_HasVideoTrack, CAPI_MediaNetwork_SetMute, CAPI_MediaNetwork_IsMute, CAPI_DeviceApi_Update, CAPI_DeviceApi_RequestUpdate, CAPI_DeviceApi_LastUpdate, CAPI_DeviceApi_Devices_Length, CAPI_DeviceApi_Devices_Get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_InitAsync", function() { return CAPI_InitAsync; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_PollInitState", function() { return CAPI_PollInitState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_SLog_SetLogLevel", function() { return CAPI_SLog_SetLogLevel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsAvailable", function() { return CAPI_WebRtcNetwork_IsAvailable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsBrowserSupported", function() { return CAPI_WebRtcNetwork_IsBrowserSupported; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Create", function() { return CAPI_WebRtcNetwork_Create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Release", function() { return CAPI_WebRtcNetwork_Release; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Connect", function() { return CAPI_WebRtcNetwork_Connect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StartServer", function() { return CAPI_WebRtcNetwork_StartServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StopServer", function() { return CAPI_WebRtcNetwork_StopServer; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Disconnect", function() { return CAPI_WebRtcNetwork_Disconnect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Shutdown", function() { return CAPI_WebRtcNetwork_Shutdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Update", function() { return CAPI_WebRtcNetwork_Update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Flush", function() { return CAPI_WebRtcNetwork_Flush; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendData", function() { return CAPI_WebRtcNetwork_SendData; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendDataEm", function() { return CAPI_WebRtcNetwork_SendDataEm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_GetBufferedAmount", function() { return CAPI_WebRtcNetwork_GetBufferedAmount; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Dequeue", function() { return CAPI_WebRtcNetwork_Dequeue; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Peek", function() { return CAPI_WebRtcNetwork_Peek; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEventDataLength", function() { return CAPI_WebRtcNetwork_PeekEventDataLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_CheckEventLength", function() { return CAPI_WebRtcNetwork_CheckEventLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_EventDataToUint8Array", function() { return CAPI_WebRtcNetwork_EventDataToUint8Array; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_DequeueEm", function() { return CAPI_WebRtcNetwork_DequeueEm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEm", function() { return CAPI_WebRtcNetwork_PeekEm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsAvailable", function() { return CAPI_MediaNetwork_IsAvailable; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasUserMedia", function() { return CAPI_MediaNetwork_HasUserMedia; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Create", function() { return CAPI_MediaNetwork_Create; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Configure", function() { return CAPI_MediaNetwork_Configure; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationState", function() { return CAPI_MediaNetwork_GetConfigurationState; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationError", function() { return CAPI_MediaNetwork_GetConfigurationError; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_ResetConfiguration", function() { return CAPI_MediaNetwork_ResetConfiguration; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame", function() { return CAPI_MediaNetwork_TryGetFrame; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrameDataLength", function() { return CAPI_MediaNetwork_TryGetFrameDataLength; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetVolume", function() { return CAPI_MediaNetwork_SetVolume; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasAudioTrack", function() { return CAPI_MediaNetwork_HasAudioTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasVideoTrack", function() { return CAPI_MediaNetwork_HasVideoTrack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetMute", function() { return CAPI_MediaNetwork_SetMute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsMute", function() { return CAPI_MediaNetwork_IsMute; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Update", function() { return CAPI_DeviceApi_Update; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_RequestUpdate", function() { return CAPI_DeviceApi_RequestUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_LastUpdate", function() { return CAPI_DeviceApi_LastUpdate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Devices_Length", function() { return CAPI_DeviceApi_Devices_Length; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Devices_Get", function() { return CAPI_DeviceApi_Devices_Get; });
/* harmony import */ var _network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../network/index */ "./src/awrtc/network/index.ts");
/* harmony import */ var _media_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../media/index */ "./src/awrtc/media/index.ts");
/* harmony import */ var _media_browser_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../media_browser/index */ "./src/awrtc/media_browser/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
/**This file contains the mapping between the awrtc_browser library and
 * Unitys WebGL support. Not needed for regular use.
 */



var CAPI_InitMode = {
    //Original mode. Devices will be unknown after startup
    Default: 0,
    //Waits for the desvice info to come in
    //names might be missing though (browser security thing)
    WaitForDevices: 1,
    //Asks the user for camera / audio access to be able to
    //get accurate device information
    RequestAccess: 2
};
var CAPI_InitState = {
    Uninitialized: 0,
    Initializing: 1,
    Initialized: 2,
    Failed: 3
};
var gCAPI_InitState = CAPI_InitState.Uninitialized;
function CAPI_InitAsync(initmode) {
    console.debug("CAPI_InitAsync mode: " + initmode);
    gCAPI_InitState = CAPI_InitState.Initializing;
    var hasDevApi = _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].IsApiAvailable();
    if (hasDevApi && initmode == CAPI_InitMode.WaitForDevices) {
        _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Update();
    }
    else if (hasDevApi && initmode == CAPI_InitMode.RequestAccess) {
        _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].RequestUpdate();
    }
    else {
        //either no device access available or not requested. Switch
        //to init state immediately without device info
        gCAPI_InitState = CAPI_InitState.Initialized;
        if (hasDevApi == false) {
            console.debug("Initialized without accessible DeviceAPI");
        }
    }
}
function CAPI_PollInitState() {
    //keep checking if the DeviceApi left pending state
    //Once completed init is finished.
    //Later we might do more here
    if (_media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].IsPending == false && gCAPI_InitState == CAPI_InitState.Initializing) {
        gCAPI_InitState = CAPI_InitState.Initialized;
        console.debug("Init completed.");
    }
    return gCAPI_InitState;
}
/**
 *
 * @param loglevel
 * None = 0,
 * Errors = 1,
 * Warnings = 2,
 * Verbose = 3
 */
function CAPI_SLog_SetLogLevel(loglevel) {
    if (loglevel < 0 || loglevel > 3) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogError("Invalid log level " + loglevel);
        return;
    }
    _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].SetLogLevel(loglevel);
}
var gCAPI_WebRtcNetwork_Instances = {};
var gCAPI_WebRtcNetwork_InstancesNextIndex = 1;
function CAPI_WebRtcNetwork_IsAvailable() {
    //used by C# component to check if this plugin is loaded.
    //can only go wrong due to programming error / packaging
    if (_network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"] && _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"])
        return true;
    return false;
}
function CAPI_WebRtcNetwork_IsBrowserSupported() {
    if (RTCPeerConnection && RTCDataChannel)
        return true;
    return false;
}
function CAPI_WebRtcNetwork_Create(lConfiguration) {
    var lIndex = gCAPI_WebRtcNetwork_InstancesNextIndex;
    gCAPI_WebRtcNetwork_InstancesNextIndex++;
    var signaling_class = "LocalNetwork";
    var signaling_param = null;
    var iceServers;
    if (lConfiguration == null || typeof lConfiguration !== 'string' || lConfiguration.length === 0) {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogError("invalid configuration. Returning -1! Config: " + lConfiguration);
        return -1;
    }
    else {
        var conf = JSON.parse(lConfiguration);
        if (conf) {
            if (conf.signaling) {
                signaling_class = conf.signaling.class;
                signaling_param = conf.signaling.param;
            }
            if (conf.iceServers) {
                iceServers = conf.iceServers;
            }
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].L(signaling_class);
            //this seems to be broken after switch to modules
            //let signalingNetworkClass = window[signaling_class];
            //let signalingNetworkClass =  new (<any>window)["awrtc.LocalNetwork"];
            //console.debug(signalingNetworkClass);
            var signalingNetworkClass = void 0;
            if (signaling_class === "LocalNetwork") {
                signalingNetworkClass = _network_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"];
            }
            else {
                signalingNetworkClass = _network_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"];
            }
            var signalingConfig = new _network_index__WEBPACK_IMPORTED_MODULE_0__["SignalingConfig"](new signalingNetworkClass(signaling_param));
            var rtcConfiguration = { iceServers: iceServers };
            gCAPI_WebRtcNetwork_Instances[lIndex] = new _network_index__WEBPACK_IMPORTED_MODULE_0__["WebRtcNetwork"](signalingConfig, rtcConfiguration);
        }
        else {
            _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LogWarning("Parsing configuration failed. Configuration: " + lConfiguration);
            return -1;
        }
    }
    //gCAPI_WebRtcNetwork_Instances[lIndex].OnLog = function (lMsg) {
    //    console.debug(lMsg);
    //};
    return lIndex;
}
function CAPI_WebRtcNetwork_Release(lIndex) {
    if (lIndex in gCAPI_WebRtcNetwork_Instances) {
        gCAPI_WebRtcNetwork_Instances[lIndex].Dispose();
        delete gCAPI_WebRtcNetwork_Instances[lIndex];
    }
}
function CAPI_WebRtcNetwork_Connect(lIndex, lRoom) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].Connect(lRoom);
}
function CAPI_WebRtcNetwork_StartServer(lIndex, lRoom) {
    gCAPI_WebRtcNetwork_Instances[lIndex].StartServer(lRoom);
}
function CAPI_WebRtcNetwork_StopServer(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].StopServer();
}
function CAPI_WebRtcNetwork_Disconnect(lIndex, lConnectionId) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Disconnect(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId));
}
function CAPI_WebRtcNetwork_Shutdown(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Shutdown();
}
function CAPI_WebRtcNetwork_Update(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Update();
}
function CAPI_WebRtcNetwork_Flush(lIndex) {
    gCAPI_WebRtcNetwork_Instances[lIndex].Flush();
}
function CAPI_WebRtcNetwork_SendData(lIndex, lConnectionId, lUint8ArrayData, lReliable) {
    gCAPI_WebRtcNetwork_Instances[lIndex].SendData(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId), lUint8ArrayData, lReliable);
}
//helper for emscripten
function CAPI_WebRtcNetwork_SendDataEm(lIndex, lConnectionId, lUint8ArrayData, lUint8ArrayDataOffset, lUint8ArrayDataLength, lReliable) {
    //console.debug("SendDataEm: " + lReliable + " length " + lUint8ArrayDataLength + " to " + lConnectionId);
    var arrayBuffer = new Uint8Array(lUint8ArrayData.buffer, lUint8ArrayDataOffset, lUint8ArrayDataLength);
    return gCAPI_WebRtcNetwork_Instances[lIndex].SendData(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId), arrayBuffer, lReliable);
}
function CAPI_WebRtcNetwork_GetBufferedAmount(lIndex, lConnectionId, lReliable) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].GetBufferedAmount(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId), lReliable);
}
function CAPI_WebRtcNetwork_Dequeue(lIndex) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].Dequeue();
}
function CAPI_WebRtcNetwork_Peek(lIndex) {
    return gCAPI_WebRtcNetwork_Instances[lIndex].Peek();
}
/**Allows to peek into the next event to figure out its length and allocate
 * the memory needed to store it before calling
 *      CAPI_WebRtcNetwork_DequeueEm
 *
 * @param {type} lIndex
 * @returns {Number}
 */
function CAPI_WebRtcNetwork_PeekEventDataLength(lIndex) {
    var lNetEvent = gCAPI_WebRtcNetwork_Instances[lIndex].Peek();
    return CAPI_WebRtcNetwork_CheckEventLength(lNetEvent);
}
//helper
function CAPI_WebRtcNetwork_CheckEventLength(lNetEvent) {
    if (lNetEvent == null) {
        //invalid event
        return -1;
    }
    else if (lNetEvent.RawData == null) {
        //no data
        return 0;
    }
    else if (typeof lNetEvent.RawData === "string") {
        //no user strings are allowed thus we get away with counting the characters
        //(ASCII only!)
        return lNetEvent.RawData.length;
    }
    else //message event types 1 and 2 only? check for it?
     {
        //its not null and not a string. can only be a Uint8Array if we didn't
        //mess something up in the implementation
        return lNetEvent.RawData.length;
    }
}
function CAPI_WebRtcNetwork_EventDataToUint8Array(data, dataUint8Array, dataOffset, dataLength) {
    //data can be null, string or Uint8Array
    //return value will be the length of data we used
    if (data == null) {
        return 0;
    }
    else if ((typeof data) === "string") {
        //in case we don't get a large enough array we need to cut off the string
        var i = 0;
        for (i = 0; i < data.length && i < dataLength; i++) {
            dataUint8Array[dataOffset + i] = data.charCodeAt(i);
        }
        return i;
    }
    else {
        var i = 0;
        //in case we don't get a large enough array we need to cut off the string
        for (i = 0; i < data.length && i < dataLength; i++) {
            dataUint8Array[dataOffset + i] = data[i];
        }
        return i;
    }
}
//Version for emscripten or anything that doesn't have a garbage collector.
// The memory for everything needs to be allocated before the call.
function CAPI_WebRtcNetwork_DequeueEm(lIndex, lTypeIntArray, lTypeIntIndex, lConidIntArray, lConidIndex, lDataUint8Array, lDataOffset, lDataLength, lDataLenIntArray, lDataLenIntIndex) {
    var nEvt = CAPI_WebRtcNetwork_Dequeue(lIndex);
    if (nEvt == null)
        return false;
    lTypeIntArray[lTypeIntIndex] = nEvt.Type;
    lConidIntArray[lConidIndex] = nEvt.ConnectionId.id;
    //console.debug("event" + nEvt.netEventType);
    var length = CAPI_WebRtcNetwork_EventDataToUint8Array(nEvt.RawData, lDataUint8Array, lDataOffset, lDataLength);
    lDataLenIntArray[lDataLenIntIndex] = length; //return the length if so the user knows how much of the given array is used
    return true;
}
function CAPI_WebRtcNetwork_PeekEm(lIndex, lTypeIntArray, lTypeIntIndex, lConidIntArray, lConidIndex, lDataUint8Array, lDataOffset, lDataLength, lDataLenIntArray, lDataLenIntIndex) {
    var nEvt = CAPI_WebRtcNetwork_Peek(lIndex);
    if (nEvt == null)
        return false;
    lTypeIntArray[lTypeIntIndex] = nEvt.Type;
    lConidIntArray[lConidIndex] = nEvt.ConnectionId.id;
    //console.debug("event" + nEvt.netEventType);
    var length = CAPI_WebRtcNetwork_EventDataToUint8Array(nEvt.RawData, lDataUint8Array, lDataOffset, lDataLength);
    lDataLenIntArray[lDataLenIntIndex] = length; //return the length if so the user knows how much of the given array is used
    return true;
}
function CAPI_MediaNetwork_IsAvailable() {
    if (_media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaNetwork"] && _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserWebRtcCall"])
        return true;
    return false;
}
function CAPI_MediaNetwork_HasUserMedia() {
    if (navigator && navigator.mediaDevices)
        return true;
    return false;
}
function CAPI_MediaNetwork_Create(lJsonConfiguration) {
    var config = new _media_index__WEBPACK_IMPORTED_MODULE_1__["NetworkConfig"]();
    config = JSON.parse(lJsonConfiguration);
    var mediaNetwork = new _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["BrowserMediaNetwork"](config);
    var lIndex = gCAPI_WebRtcNetwork_InstancesNextIndex;
    gCAPI_WebRtcNetwork_InstancesNextIndex++;
    gCAPI_WebRtcNetwork_Instances[lIndex] = mediaNetwork;
    return lIndex;
}
//Configure(config: MediaConfig): void;
function CAPI_MediaNetwork_Configure(lIndex, audio, video, minWidth, minHeight, maxWidth, maxHeight, idealWidth, idealHeight, minFps, maxFps, idealFps, deviceName) {
    if (deviceName === void 0) { deviceName = ""; }
    var config = new _media_index__WEBPACK_IMPORTED_MODULE_1__["MediaConfig"]();
    config.Audio = audio;
    config.Video = video;
    config.MinWidth = minWidth;
    config.MinHeight = minHeight;
    config.MaxWidth = maxWidth;
    config.MaxHeight = maxHeight;
    config.IdealWidth = idealWidth;
    config.IdealHeight = idealHeight;
    config.MinFps = minFps;
    config.MaxFps = maxFps;
    config.IdealFps = idealFps;
    config.VideoDeviceName = deviceName;
    config.FrameUpdates = true;
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    mediaNetwork.Configure(config);
}
//GetConfigurationState(): MediaConfigurationState;
function CAPI_MediaNetwork_GetConfigurationState(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.GetConfigurationState();
}
//Note: not yet glued to the C# version!
//GetConfigurationError(): string;
function CAPI_MediaNetwork_GetConfigurationError(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.GetConfigurationError();
}
//ResetConfiguration(): void;
function CAPI_MediaNetwork_ResetConfiguration(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.ResetConfiguration();
}
//TryGetFrame(id: ConnectionId): RawFrame;
function CAPI_MediaNetwork_TryGetFrame(lIndex, lConnectionId, lWidthInt32Array, lWidthIntArrayIndex, lHeightInt32Array, lHeightIntArrayIndex, lBufferUint8Array, lBufferUint8ArrayOffset, lBufferUint8ArrayLength) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    var frame = mediaNetwork.TryGetFrame(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](lConnectionId));
    if (frame == null || frame.Buffer == null) {
        return false;
    }
    else {
        //TODO: copy frame over
        lWidthInt32Array[lWidthIntArrayIndex] = frame.Width;
        lHeightInt32Array[lHeightIntArrayIndex] = frame.Height;
        for (var i = 0; i < lBufferUint8ArrayLength && i < frame.Buffer.length; i++) {
            lBufferUint8Array[lBufferUint8ArrayOffset + i] = frame.Buffer[i];
        }
        return true;
    }
}
//Returns the frame buffer size or -1 if no frame is available
function CAPI_MediaNetwork_TryGetFrameDataLength(lIndex, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    var frame = mediaNetwork.PeekFrame(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
    var length = -1;
    //added frame.Buffer != null as the frame might be a LazyFrame just creating a copy of the html video element
    //in the moment frame.Buffer is called. if this fails for any reasion it might return null despite
    //the frame object itself being available
    if (frame != null && frame.Buffer != null) {
        length = frame.Buffer.length;
    }
    //SLog.L("data length:" + length);
    return length;
}
function CAPI_MediaNetwork_SetVolume(lIndex, volume, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    mediaNetwork.SetVolume(volume, new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
}
function CAPI_MediaNetwork_HasAudioTrack(lIndex, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.HasAudioTrack(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
}
function CAPI_MediaNetwork_HasVideoTrack(lIndex, connectionId) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.HasVideoTrack(new _network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"](connectionId));
}
function CAPI_MediaNetwork_SetMute(lIndex, value) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    mediaNetwork.SetMute(value);
}
function CAPI_MediaNetwork_IsMute(lIndex) {
    var mediaNetwork = gCAPI_WebRtcNetwork_Instances[lIndex];
    return mediaNetwork.IsMute();
}
function CAPI_DeviceApi_Update() {
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Update();
}
function CAPI_DeviceApi_RequestUpdate() {
    _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].RequestUpdate();
}
function CAPI_DeviceApi_LastUpdate() {
    return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].LastUpdate;
}
function CAPI_DeviceApi_Devices_Length() {
    return Object.keys(_media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Devices).length;
}
function CAPI_DeviceApi_Devices_Get(index) {
    var keys = Object.keys(_media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Devices);
    if (keys.length > index) {
        var key = keys[index];
        return _media_browser_index__WEBPACK_IMPORTED_MODULE_2__["DeviceApi"].Devices[key].label;
    }
    else {
        _network_index__WEBPACK_IMPORTED_MODULE_0__["SLog"].LE("Requested device with index " + index + " does not exist.");
        return "";
    }
}


/***/ }),

/***/ "./src/awrtc/unity/index.ts":
/*!**********************************!*\
  !*** ./src/awrtc/unity/index.ts ***!
  \**********************************/
/*! exports provided: CAPI_InitAsync, CAPI_PollInitState, CAPI_SLog_SetLogLevel, CAPI_WebRtcNetwork_IsAvailable, CAPI_WebRtcNetwork_IsBrowserSupported, CAPI_WebRtcNetwork_Create, CAPI_WebRtcNetwork_Release, CAPI_WebRtcNetwork_Connect, CAPI_WebRtcNetwork_StartServer, CAPI_WebRtcNetwork_StopServer, CAPI_WebRtcNetwork_Disconnect, CAPI_WebRtcNetwork_Shutdown, CAPI_WebRtcNetwork_Update, CAPI_WebRtcNetwork_Flush, CAPI_WebRtcNetwork_SendData, CAPI_WebRtcNetwork_SendDataEm, CAPI_WebRtcNetwork_GetBufferedAmount, CAPI_WebRtcNetwork_Dequeue, CAPI_WebRtcNetwork_Peek, CAPI_WebRtcNetwork_PeekEventDataLength, CAPI_WebRtcNetwork_CheckEventLength, CAPI_WebRtcNetwork_EventDataToUint8Array, CAPI_WebRtcNetwork_DequeueEm, CAPI_WebRtcNetwork_PeekEm, CAPI_MediaNetwork_IsAvailable, CAPI_MediaNetwork_HasUserMedia, CAPI_MediaNetwork_Create, CAPI_MediaNetwork_Configure, CAPI_MediaNetwork_GetConfigurationState, CAPI_MediaNetwork_GetConfigurationError, CAPI_MediaNetwork_ResetConfiguration, CAPI_MediaNetwork_TryGetFrame, CAPI_MediaNetwork_TryGetFrameDataLength, CAPI_MediaNetwork_SetVolume, CAPI_MediaNetwork_HasAudioTrack, CAPI_MediaNetwork_HasVideoTrack, CAPI_MediaNetwork_SetMute, CAPI_MediaNetwork_IsMute, CAPI_DeviceApi_Update, CAPI_DeviceApi_RequestUpdate, CAPI_DeviceApi_LastUpdate, CAPI_DeviceApi_Devices_Length, CAPI_DeviceApi_Devices_Get */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _CAPI__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CAPI */ "./src/awrtc/unity/CAPI.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_InitAsync", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_InitAsync"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_PollInitState", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_PollInitState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_SLog_SetLogLevel", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_SLog_SetLogLevel"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsAvailable", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_IsBrowserSupported", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_IsBrowserSupported"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Create", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Release", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Release"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Connect", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Connect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StartServer", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_StartServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_StopServer", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_StopServer"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Disconnect", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Disconnect"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Shutdown", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Shutdown"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Update", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Flush", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Flush"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendData", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_SendData"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_SendDataEm", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_SendDataEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_GetBufferedAmount", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_GetBufferedAmount"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Dequeue", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Dequeue"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_Peek", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_Peek"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEventDataLength", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_PeekEventDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_CheckEventLength", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_CheckEventLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_EventDataToUint8Array", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_EventDataToUint8Array"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_DequeueEm", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_DequeueEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_WebRtcNetwork_PeekEm", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_WebRtcNetwork_PeekEm"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsAvailable", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_IsAvailable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasUserMedia", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_HasUserMedia"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Create", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_Create"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_Configure", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_Configure"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationState", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_GetConfigurationState"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_GetConfigurationError", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_GetConfigurationError"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_ResetConfiguration", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_ResetConfiguration"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrame", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_TryGetFrame"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_TryGetFrameDataLength", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_TryGetFrameDataLength"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetVolume", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_SetVolume"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasAudioTrack", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_HasAudioTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_HasVideoTrack", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_HasVideoTrack"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_SetMute", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_SetMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_MediaNetwork_IsMute", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_MediaNetwork_IsMute"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Update", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Update"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_RequestUpdate", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_RequestUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_LastUpdate", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_LastUpdate"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Devices_Length", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Devices_Length"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CAPI_DeviceApi_Devices_Get", function() { return _CAPI__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Devices_Get"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



/***/ }),

/***/ "./src/test/BrowserApiTest.ts":
/*!************************************!*\
  !*** ./src/test/BrowserApiTest.ts ***!
  \************************************/
/*! exports provided: some_random_export_1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "some_random_export_1", function() { return some_random_export_1; });
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//current setup needs to load everything as a module
function some_random_export_1() {
}
describe("BrowserApiTest_MediaStreamApi", function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it("devices", function (done) {
        navigator.mediaDevices.enumerateDevices()
            .then(function (devices) {
            expect(devices).not.toBeNull();
            devices.forEach(function (device) {
                console.log(device.kind + ": " + device.label +
                    " id = " + device.deviceId);
            });
            done();
        })
            .catch(function (err) {
            console.log(err.name + ": " + err.message);
            fail();
        });
    });
    it("devices2", function (done) {
        var gStream;
        var constraints = { video: { deviceId: undefined }, audio: { deviceId: undefined } };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
            //if this stream stops the access to labels disapears again after
            //a few ms (tested in firefox)
            gStream = stream;
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                expect(devices).not.toBeNull();
                devices.forEach(function (device) {
                    expect(device.label).not.toBeNull();
                    expect(device.label).not.toBe("");
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                });
                gStream.getTracks().forEach(function (t) {
                    t.stop();
                });
                done();
            })
                .catch(function (err) {
                console.log(err.name + ": " + err.message);
                fail();
            });
        })
            .catch(function (err) {
            console.log(err.name + ": " + err.message);
            fail();
        });
    });
    it("devices3", function (done) {
        var gStream;
        var constraints = { video: true, audio: false };
        navigator.mediaDevices.getUserMedia(constraints)
            .then(function (stream) {
            //if this stream stops the access to labels disapears again after
            //a few ms (tested in firefox)
            gStream = stream;
            navigator.mediaDevices.enumerateDevices()
                .then(function (devices) {
                expect(devices).not.toBeNull();
                devices.forEach(function (device) {
                    expect(device.label).not.toBeNull();
                    expect(device.label).not.toBe("");
                    console.log(device.kind + ": " + device.label +
                        " id = " + device.deviceId);
                });
                gStream.getTracks().forEach(function (t) {
                    t.stop();
                });
                done();
            })
                .catch(function (err) {
                console.log(err.name + ": " + err.message);
                fail();
            });
        })
            .catch(function (err) {
            console.log(err.name + ": " + err.message);
            fail();
        });
    });
});


/***/ }),

/***/ "./src/test/CallTest.ts":
/*!******************************!*\
  !*** ./src/test/CallTest.ts ***!
  \******************************/
/*! exports provided: CallTestHelper */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CallTestHelper", function() { return CallTestHelper; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var CallTestHelper = /** @class */ (function () {
    function CallTestHelper() {
    }
    CallTestHelper.CreateCall = function (video, audio) {
        var nconfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetworkConfig"]();
        nconfig.SignalingUrl = "wss://signaling.because-why-not.com:443/test";
        var call = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserWebRtcCall"](nconfig);
        return call;
    };
    return CallTestHelper;
}());

describe("CallTest", function () {
    var originalTimeout;
    beforeEach(function () {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;
    });
    afterEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
    it("CallTest normal", function () {
        expect(true).toBe(true);
    });
    it("CallTest async", function (done) {
        setTimeout(function () {
            expect(true).toBe(true);
            done();
        }, 1000);
    });
    it("Send test", function (done) {
        var call1 = null;
        var call2 = null;
        var call1ToCall2;
        var call2ToCall1;
        var address = "webunittest";
        var teststring1 = "teststring1";
        var teststring2 = "teststring2";
        var testdata1 = new Uint8Array([1, 2]);
        var testdata2 = new Uint8Array([3, 4]);
        call1 = CallTestHelper.CreateCall(false, false);
        expect(call1).not.toBeNull();
        call2 = CallTestHelper.CreateCall(false, false);
        expect(call2).not.toBeNull();
        expect(true).toBe(true);
        var mconfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
        mconfig.Audio = false;
        mconfig.Video = false;
        call1.addEventListener(function (sender, args) {
            if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].ConfigurationComplete) {
                console.debug("call1 ConfigurationComplete");
                call2.Configure(mconfig);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].WaitForIncomingCall) {
                console.debug("call1 WaitForIncomingCall");
                call2.Call(address);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].CallAccepted) {
                var ar = args;
                call1ToCall2 = ar.ConnectionId;
                //wait for message
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].Message) {
                console.debug("call1 Message");
                var margs = args;
                expect(margs.Content).toBe(teststring1);
                expect(margs.Reliable).toBe(true);
                call1.Send(teststring2, false, call1ToCall2);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].DataMessage) {
                console.debug("call1 DataMessage");
                var dargs = args;
                expect(dargs.Reliable).toBe(true);
                var recdata = dargs.Content;
                expect(testdata1[0]).toBe(recdata[0]);
                expect(testdata1[1]).toBe(recdata[1]);
                console.debug("call1 send DataMessage");
                call1.SendData(testdata2, false, call1ToCall2);
            }
            else {
                console.error("unexpected event: " + args.Type);
                expect(true).toBe(false);
            }
        });
        call2.addEventListener(function (sender, args) {
            if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].ConfigurationComplete) {
                console.debug("call2 ConfigurationComplete");
                call1.Listen(address);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].CallAccepted) {
                var ar = args;
                call2ToCall1 = ar.ConnectionId;
                expect(call2ToCall1).toBeDefined();
                call2.Send(teststring1);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].Message) {
                console.debug("call2 Message");
                var margs = args;
                expect(margs.Content).toBe(teststring2);
                expect(margs.Reliable).toBe(false);
                console.debug("call2 send DataMessage " + call2ToCall1.id);
                call2.SendData(testdata1, true, call2ToCall1);
            }
            else if (args.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CallEventType"].DataMessage) {
                console.debug("call2 DataMessage");
                var dargs = args;
                expect(dargs.Reliable).toBe(false);
                var recdata = dargs.Content;
                expect(testdata2[0]).toBe(recdata[0]);
                expect(testdata2[1]).toBe(recdata[1]);
                done();
            }
            else {
                console.error("unexpected event: " + args.Type);
                expect(true).toBe(false);
            }
        });
        setInterval(function () {
            call1.Update();
            call2.Update();
        }, 50);
        call1.Configure(mconfig);
    });
});


/***/ }),

/***/ "./src/test/DeviceApiTest.ts":
/*!***********************************!*\
  !*** ./src/test/DeviceApiTest.ts ***!
  \***********************************/
/*! exports provided: DeviceApiTest_export */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DeviceApiTest_export", function() { return DeviceApiTest_export; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
//current setup needs to load everything as a module

function DeviceApiTest_export() {
}
describe("DeviceApiTest", function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Reset();
    });
    function printall() {
        console.log("current DeviceApi.Devices:");
        for (var k in _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices) {
            var v = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices[k];
            console.log(v.deviceId + " defaultLabel:" + v.defaultLabel + " label:" + v.label + " guessed:" + v.isLabelGuessed);
        }
    }
    it("update", function (done) {
        var update1complete = false;
        var update2complete = false;
        var deviceCount = 0;
        expect(Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices).length).toBe(0);
        //first without device labels
        var updatecall1 = function () {
            expect(update1complete).toBe(false);
            expect(update2complete).toBe(false);
            console.debug("updatecall1");
            printall();
            var devices1 = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices;
            deviceCount = Object.keys(devices1).length;
            expect(deviceCount).toBeGreaterThan(0);
            var key1 = Object.keys(devices1)[0];
            expect(devices1[key1].label).toBe("videoinput 1");
            expect(devices1[key1].isLabelGuessed).toBe(true);
            if (deviceCount > 1) {
                var key2 = Object.keys(devices1)[1];
                expect(devices1[key2].label).toBe("videoinput 2");
                expect(devices1[key2].isLabelGuessed).toBe(true);
            }
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].RemOnChangedHandler(updatecall1);
            //second call with device labels
            var updatecall2 = function () {
                console.debug("updatecall2");
                printall();
                //check if the handler work properly
                expect(update1complete).toBe(true);
                expect(update2complete).toBe(false);
                //sadly can't simulate fixed device names for testing
                var devices2 = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices;
                expect(Object.keys(devices2).length).toBe(deviceCount);
                var key2 = Object.keys(devices2)[0];
                //should have original label now
                expect(devices2[key1].label).not.toBe("videodevice 1");
                //and not be guessed anymore
                expect(devices2[key1].isLabelGuessed).toBe(false, "Chrome fails this now. Likely due to file://. Check for better test setup");
                update2complete = true;
                _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Reset();
                expect(Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices).length).toBe(0);
                done();
            };
            update1complete = true;
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(updatecall2);
            _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].RequestUpdate();
        };
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].AddOnChangedHandler(updatecall1);
        _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Update();
    });
    it("capi_update", function (done) {
        var update1complete = false;
        var update2complete = false;
        var deviceCount = 0;
        expect(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Devices_Length"])()).toBe(0);
        Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Update"])();
        setTimeout(function () {
            expect(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Devices_Length"])()).not.toBe(0);
            expect(Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Devices_Length"])()).toBe(Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices).length);
            var keys = Object.keys(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices);
            var counter = 0;
            for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                var k = keys_1[_i];
                var expectedVal = _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["DeviceApi"].Devices[k].label;
                var actual = Object(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["CAPI_DeviceApi_Devices_Get"])(counter);
                expect(actual).toBe(expectedVal);
                counter++;
            }
            done();
        }, 100);
    });
});


/***/ }),

/***/ "./src/test/LocalNetworkTest.ts":
/*!**************************************!*\
  !*** ./src/test/LocalNetworkTest.ts ***!
  \**************************************/
/*! exports provided: LocalNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "LocalNetworkTest", function() { return LocalNetworkTest; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/* harmony import */ var helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helper/IBasicNetworkTest */ "./src/test/helper/IBasicNetworkTest.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var LocalNetworkTest = /** @class */ (function (_super) {
    __extends(LocalNetworkTest, _super);
    function LocalNetworkTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LocalNetworkTest.prototype.setup = function () {
        _super.prototype.setup.call(this);
        //special tests
    };
    LocalNetworkTest.prototype._CreateNetworkImpl = function () {
        return new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["LocalNetwork"]();
    };
    return LocalNetworkTest;
}(helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__["IBasicNetworkTest"]));

describe("LocalNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    var test = new LocalNetworkTest();
    test.setup();
});


/***/ }),

/***/ "./src/test/MediaNetworkTest.ts":
/*!**************************************!*\
  !*** ./src/test/MediaNetworkTest.ts ***!
  \**************************************/
/*! exports provided: MediaNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MediaNetworkTest", function() { return MediaNetworkTest; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var MediaNetworkTest = /** @class */ (function () {
    function MediaNetworkTest() {
        this.createdNetworks = [];
    }
    MediaNetworkTest.prototype.createDefault = function () {
        var netConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetworkConfig"]();
        netConfig.SignalingUrl = null;
        var createdNetwork = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["BrowserMediaNetwork"](netConfig);
        this.createdNetworks.push(createdNetwork);
        return createdNetwork;
    };
    MediaNetworkTest.prototype.setup = function () {
        var _this = this;
        beforeEach(function () {
            jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
        });
        afterEach(function () {
            for (var _i = 0, _a = _this.createdNetworks; _i < _a.length; _i++) {
                var net = _a[_i];
                net.Dispose();
            }
            _this.createdNetworks = new Array();
        });
        it("FrameUpdates", function (done) {
            var mediaConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
            var network = _this.createDefault();
            network.Configure(mediaConfig);
            setInterval(function () {
                network.Update();
                var localFrame = network.TryGetFrame(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID);
                if (localFrame != null) {
                    expect(localFrame.Height).toBeGreaterThan(0);
                    expect(localFrame.Width).toBeGreaterThan(0);
                    expect(localFrame.Buffer).not.toBeNull();
                    done();
                }
                network.Flush();
            }, 10);
        });
        it("MediaEvent", function (done) {
            var mediaConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]();
            var network = _this.createDefault();
            network.Configure(mediaConfig);
            setInterval(function () {
                network.Update();
                var evt = null;
                while ((evt = network.DequeueMediaEvent()) != null) {
                    expect(evt.EventType).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaEventType"].StreamAdded);
                    expect(evt.Args.videoHeight).toBeGreaterThan(0);
                    expect(evt.Args.videoWidth).toBeGreaterThan(0);
                    done();
                }
                network.Flush();
            }, 10);
        });
        it("MediaEventRemote", function (done) {
            var testaddress = "testaddress" + Math.random();
            var sender = _this.createDefault();
            var receiver = _this.createDefault();
            var configureComplete = false;
            var senderFrame = false;
            var receiverFrame = false;
            sender.Configure(new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfig"]());
            setInterval(function () {
                sender.Update();
                receiver.Update();
                if (configureComplete == false) {
                    var state = sender.GetConfigurationState();
                    if (state == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Successful) {
                        configureComplete = true;
                        sender.StartServer(testaddress);
                    }
                    else if (state == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaConfigurationState"].Failed) {
                        fail();
                    }
                }
                var sndEvt = sender.Dequeue();
                if (sndEvt != null) {
                    console.log("sender event: " + sndEvt);
                    if (sndEvt.Type == _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized) {
                        receiver.Connect(testaddress);
                    }
                }
                var recEvt = receiver.Dequeue();
                if (recEvt != null) {
                    console.log("receiver event: " + recEvt);
                }
                var evt = null;
                while ((evt = sender.DequeueMediaEvent()) != null) {
                    expect(evt.EventType).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaEventType"].StreamAdded);
                    expect(evt.Args.videoHeight).toBeGreaterThan(0);
                    expect(evt.Args.videoWidth).toBeGreaterThan(0);
                    senderFrame = true;
                    console.log("sender received first frame");
                }
                while ((evt = receiver.DequeueMediaEvent()) != null) {
                    expect(evt.EventType).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["MediaEventType"].StreamAdded);
                    expect(evt.Args.videoHeight).toBeGreaterThan(0);
                    expect(evt.Args.videoWidth).toBeGreaterThan(0);
                    receiverFrame = true;
                    console.log("receiver received first frame");
                }
                sender.Flush();
                receiver.Flush();
                if (senderFrame && receiverFrame)
                    done();
            }, 10);
        });
    };
    return MediaNetworkTest;
}());

describe("MediaNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    var test = new MediaNetworkTest();
    test.setup();
});


/***/ }),

/***/ "./src/test/WebRtcNetworkTest.ts":
/*!***************************************!*\
  !*** ./src/test/WebRtcNetworkTest.ts ***!
  \***************************************/
/*! exports provided: WebRtcNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkTest", function() { return WebRtcNetworkTest; });
/* harmony import */ var WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! WebsocketNetworkTest */ "./src/test/WebsocketNetworkTest.ts");
/* harmony import */ var helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helper/IBasicNetworkTest */ "./src/test/helper/IBasicNetworkTest.ts");
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/



var WebRtcNetworkTest = /** @class */ (function (_super) {
    __extends(WebRtcNetworkTest, _super);
    function WebRtcNetworkTest() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.mUrl = WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__["WebsocketTest"].sUrl;
        //allows each test to overwrite the default behaviour
        _this.mUseWebsockets = false;
        return _this;
    }
    WebRtcNetworkTest.prototype.setup = function () {
        var _this = this;
        beforeEach(function () {
            _this.mUrl = WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__["WebsocketTest"].sUrl;
            _this.mUseWebsockets = WebRtcNetworkTest.mAlwaysUseWebsockets;
        });
        it("GetBufferedAmount", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.then(function () {
                //TODO: more detailed testing by actually triggering the buffer to fill?
                //might be tricky as this is very system dependent
                var buf;
                buf = srv.GetBufferedAmount(srvToCltId, false);
                expect(buf).toBe(0);
                buf = srv.GetBufferedAmount(srvToCltId, true);
                expect(buf).toBe(0);
                buf = clt.GetBufferedAmount(cltToSrvId, false);
                expect(buf).toBe(0);
                buf = clt.GetBufferedAmount(cltToSrvId, true);
                expect(buf).toBe(0);
                done();
            });
            _this.start();
        });
        it("SharedAddress", function (done) {
            //turn off websockets and use shared websockets for this test as local network doesn't support shared mode
            _this.mUseWebsockets = true;
            _this.mUrl = WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_0__["WebsocketTest"].sUrlShared;
            var sharedAddress = "sharedtestaddress";
            var evt;
            var net1;
            var net2;
            _this.thenAsync(function (finished) {
                net1 = _this._CreateNetwork();
                net1.StartServer(sharedAddress);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].ServerInitialized);
                net2 = _this._CreateNetwork();
                net2.StartServer(sharedAddress);
                _this.waitForEvent(net2, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].ServerInitialized);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                _this.waitForEvent(net2, finished);
            });
            _this.then(function () {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                done();
            });
            _this.start();
        });
        //connect using only direct local connections (give no ice servers)
        it("ConnectLocalOnly", function (done) {
            var srv;
            var address;
            var clt;
            var cltId;
            var evt;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                cltId = clt.Connect(address);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).toBe(cltId.id);
            });
            _this.thenAsync(function (finished) {
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).not.toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_2__["ConnectionId"].INVALID.id);
                done();
            });
            _this.start();
        });
        _super.prototype.setup.call(this);
        //special tests
    };
    WebRtcNetworkTest.prototype._CreateNetworkImpl = function () {
        var rtcConfig = { iceServers: [WebRtcNetworkTest.sDefaultIceServer] };
        var sigConfig;
        if (this.mUseWebsockets) {
            sigConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["SignalingConfig"](new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["WebsocketNetwork"](this.mUrl));
        }
        else {
            sigConfig = new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["SignalingConfig"](new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["LocalNetwork"]());
        }
        return new _awrtc_index__WEBPACK_IMPORTED_MODULE_2__["WebRtcNetwork"](sigConfig, rtcConfig);
    };
    WebRtcNetworkTest.sUrl = 'ws://localhost:12776/test';
    WebRtcNetworkTest.sUrlShared = 'ws://localhost:12776/testshared';
    WebRtcNetworkTest.sDefaultIceServer = { urls: ["stun:stun.l.google.com:19302"] };
    //will set use websocket flag for each test
    WebRtcNetworkTest.mAlwaysUseWebsockets = false;
    return WebRtcNetworkTest;
}(helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__["IBasicNetworkTest"]));

describe("WebRtcNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    var test = new WebRtcNetworkTest();
    test.mDefaultWaitTimeout = 5000;
    test.setup();
});


/***/ }),

/***/ "./src/test/WebsocketNetworkTest.ts":
/*!******************************************!*\
  !*** ./src/test/WebsocketNetworkTest.ts ***!
  \******************************************/
/*! exports provided: WebsocketTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "WebsocketTest", function() { return WebsocketTest; });
/* harmony import */ var _awrtc_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../awrtc/index */ "./src/awrtc/index.ts");
/* harmony import */ var helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! helper/IBasicNetworkTest */ "./src/test/helper/IBasicNetworkTest.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var WebsocketTest = /** @class */ (function (_super) {
    __extends(WebsocketTest, _super);
    function WebsocketTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebsocketTest.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        //special tests
        beforeEach(function () {
            _this.mUrl = WebsocketTest.sUrl;
        });
        //can only be done manually so far
        xit("Timeout", function (done) {
            //this needs to be a local test server
            //that can be disconnected to test the timeout
            _this.mUrl = "ws://192.168.1.3:12776";
            var evt;
            var srv;
            var address;
            _this.thenAsync(function (finished) {
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                console.log("Server ready at " + address);
                expect(srv).not.toBeNull();
                expect(address).not.toBeNull();
                console.debug("Waiting for timeout");
                _this.waitForEvent(srv, finished, 120000);
            });
            _this.then(function () {
                console.log("Timeout over");
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed);
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                done();
            });
            _this.start();
        }, 130000);
        it("SharedAddress", function (done) {
            _this.mUrl = WebsocketTest.sUrlShared;
            var sharedAddress = "sharedtestaddress";
            var evt;
            var net1;
            var net2;
            _this.thenAsync(function (finished) {
                net1 = _this._CreateNetwork();
                net1.StartServer(sharedAddress);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
                net2 = _this._CreateNetwork();
                net2.StartServer(sharedAddress);
                _this.waitForEvent(net2, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
                _this.waitForEvent(net1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
                _this.waitForEvent(net2, finished);
            });
            _this.then(function () {
                evt = net2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
                done();
            });
            _this.start();
        });
        it("BadUrlStartServer", function (done) {
            _this.mUrl = WebsocketTest.sBadUrl;
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                srv.StartServer();
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connecting);
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitFailed);
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                done();
            });
            _this.start();
        });
        it("BadUrlConnect", function (done) {
            _this.mUrl = WebsocketTest.sBadUrl;
            var evt;
            var clt;
            var cltId;
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                cltId = clt.Connect("invalid address");
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connecting);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ConnectionFailed);
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                done();
            });
            _this.start();
        });
        it("WebsocketState", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                //both should be connected
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connected);
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connected);
                srv.Disconnect(srvToCltId);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected);
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                //after disconnect the client doesn't have any active connections -> expect disconnected
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].Connected);
                expect(clt.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                srv.StopServer();
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerClosed);
                expect(srv.getStatus()).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketConnectionStatus"].NotConnected);
                srv.StartServer(address);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
                _this._Connect(srv, address, clt, function (srvToCltIdOut, cltToSrvIdOut) {
                    finished();
                });
            });
            _this.then(function () {
                done();
            });
            _this.start();
        });
    };
    WebsocketTest.prototype._CreateNetworkImpl = function () {
        //let url = 'ws://because-why-not.com:12776';
        return new _awrtc_index__WEBPACK_IMPORTED_MODULE_0__["WebsocketNetwork"](this.mUrl);
    };
    //replace with valid url that has a server behind it
    //public static sUrl = 'ws://localhost:12776/test';
    //public static sUrlShared = 'ws://localhost:12776/testshared';
    WebsocketTest.sUrl = 'ws://signaling.because-why-not.com';
    //public static sUrl = 'ws://192.168.1.3:12776';
    WebsocketTest.sUrlShared = 'ws://signaling.because-why-not.com/testshared';
    //any url to simulate offline server
    WebsocketTest.sBadUrl = 'ws://localhost:13776';
    return WebsocketTest;
}(helper_IBasicNetworkTest__WEBPACK_IMPORTED_MODULE_1__["IBasicNetworkTest"]));

describe("WebsocketNetworkTest", function () {
    it("TestEnvironment", function () {
        expect(null).toBeNull();
    });
    beforeEach(function () {
    });
    var test = new WebsocketTest();
    test.setup();
});


/***/ }),

/***/ "./src/test/helper/BasicNetworkTestBase.ts":
/*!*************************************************!*\
  !*** ./src/test/helper/BasicNetworkTestBase.ts ***!
  \*************************************************/
/*! exports provided: TestTaskRunner, BasicNetworkTestBase */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TestTaskRunner", function() { return TestTaskRunner; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BasicNetworkTestBase", function() { return BasicNetworkTestBase; });
/* harmony import */ var _awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../awrtc/network/index */ "./src/awrtc/network/index.ts");
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

var TestTaskRunner = /** @class */ (function () {
    function TestTaskRunner() {
        this._toDoList = new Array();
    }
    TestTaskRunner.prototype.then = function (syncTask) {
        var wrap = function (finished) {
            syncTask();
            finished();
        };
        this._toDoList.push(wrap);
    };
    TestTaskRunner.prototype.thenAsync = function (task) {
        this._toDoList.push(task);
    };
    TestTaskRunner.prototype.start = function () {
        var task = this._toDoList.shift();
        this._run(task);
    };
    TestTaskRunner.prototype.stop = function () {
    };
    TestTaskRunner.prototype._run = function (task) {
        var _this = this;
        task(function () {
            if (_this._toDoList.length > 0) {
                setTimeout(function () {
                    _this._run(_this._toDoList.shift());
                }, 1);
            }
        });
    };
    return TestTaskRunner;
}());

var BasicNetworkTestBase = /** @class */ (function () {
    function BasicNetworkTestBase() {
        this.mTestRunner = new TestTaskRunner();
        this.mCreatedNetworks = new Array();
        this.mDefaultWaitTimeout = 5000;
    }
    BasicNetworkTestBase.prototype.setup = function () {
        var _this = this;
        beforeEach(function () {
            _this.mTestRunner.stop();
            _this.mTestRunner = new TestTaskRunner();
            _this.mCreatedNetworks = new Array();
        });
    };
    BasicNetworkTestBase.prototype._CreateNetwork = function () {
        var net = this._CreateNetworkImpl();
        this.mCreatedNetworks.push(net);
        return net;
    };
    BasicNetworkTestBase.prototype.then = function (syncTask) {
        this.mTestRunner.then(syncTask);
    };
    BasicNetworkTestBase.prototype.thenAsync = function (task) {
        this.mTestRunner.thenAsync(task);
    };
    BasicNetworkTestBase.prototype.start = function () {
        this.mTestRunner.start();
    };
    //public waitForEvent(net: IBasicNetwork) {
    //    var wrap = (finished: Task) => {
    //        var timeout = 1000;
    //        var interval = 100;
    //        var intervalHandle;
    //        intervalHandle = setInterval(() => {
    //            this.UpdateAll();
    //            this.FlushAll();
    //            timeout -= interval;
    //            if (net.Peek() != null) {
    //                clearInterval(intervalHandle);
    //                finished();
    //            } else if (timeout <= 0) {
    //                clearInterval(intervalHandle);
    //                finished();
    //            }
    //        }, interval);
    //    };
    //    this.mTestRunner.thenAsync(wrap);
    //}
    BasicNetworkTestBase.prototype.waitForEvent = function (net, finished, timeout) {
        var _this = this;
        if (timeout == null)
            timeout = this.mDefaultWaitTimeout;
        var interval = 50;
        var intervalHandle;
        intervalHandle = setInterval(function () {
            _this.UpdateAll();
            _this.FlushAll();
            timeout -= interval;
            if (net.Peek() != null) {
                clearInterval(intervalHandle);
                finished();
            }
            else if (timeout <= 0) {
                clearInterval(intervalHandle);
                finished();
            }
        }, interval);
    };
    BasicNetworkTestBase.prototype.UpdateAll = function () {
        for (var _i = 0, _a = this.mCreatedNetworks; _i < _a.length; _i++) {
            var v = _a[_i];
            v.Update();
        }
    };
    BasicNetworkTestBase.prototype.FlushAll = function () {
        for (var _i = 0, _a = this.mCreatedNetworks; _i < _a.length; _i++) {
            var v = _a[_i];
            v.Flush();
        }
    };
    BasicNetworkTestBase.prototype.ShutdownAll = function () {
        for (var _i = 0, _a = this.mCreatedNetworks; _i < _a.length; _i++) {
            var v = _a[_i];
            v.Shutdown();
        }
        this.mCreatedNetworks = new Array();
    };
    BasicNetworkTestBase.prototype._CreateServerNetwork = function (result) {
        var srv = this._CreateNetwork();
        srv.StartServer();
        this.waitForEvent(srv, function () {
            var evt = srv.Dequeue();
            expect(evt).not.toBeNull();
            expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].ServerInitialized);
            expect(evt.Info).not.toBeNull();
            var address = evt.Info;
            result(srv, address);
        });
    };
    BasicNetworkTestBase.prototype._Connect = function (srv, address, clt, result) {
        var _this = this;
        var evt;
        var cltToSrvId = clt.Connect(address);
        var srvToCltId;
        this.waitForEvent(clt, function () {
            evt = clt.Dequeue();
            expect(evt).not.toBeNull();
            expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
            expect(evt.ConnectionId.id).toBe(cltToSrvId.id);
            _this.waitForEvent(srv, function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).not.toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_0__["ConnectionId"].INVALID.id);
                srvToCltId = evt.ConnectionId;
                result(srvToCltId, cltToSrvId);
            });
        });
    };
    BasicNetworkTestBase.prototype._CreateServerClient = function (result) {
        var _this = this;
        var srv;
        var address;
        var srvToCltId;
        var clt;
        var cltToSrvId;
        this._CreateServerNetwork(function (rsrv, raddress) {
            srv = rsrv;
            address = raddress;
            clt = _this._CreateNetwork();
            _this._Connect(srv, address, clt, function (rsrvToCltId, rcltToSrvId) {
                srvToCltId = rsrvToCltId;
                cltToSrvId = rcltToSrvId;
                result(srv, address, srvToCltId, clt, cltToSrvId);
            });
        });
    };
    return BasicNetworkTestBase;
}());



/***/ }),

/***/ "./src/test/helper/IBasicNetworkTest.ts":
/*!**********************************************!*\
  !*** ./src/test/helper/IBasicNetworkTest.ts ***!
  \**********************************************/
/*! exports provided: IBasicNetworkTest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "IBasicNetworkTest", function() { return IBasicNetworkTest; });
/* harmony import */ var _BasicNetworkTestBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BasicNetworkTestBase */ "./src/test/helper/BasicNetworkTestBase.ts");
/* harmony import */ var _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../awrtc/network/index */ "./src/awrtc/network/index.ts");
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/


var IBasicNetworkTest = /** @class */ (function (_super) {
    __extends(IBasicNetworkTest, _super);
    function IBasicNetworkTest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IBasicNetworkTest.prototype.setup = function () {
        var _this = this;
        _super.prototype.setup.call(this);
        var originalTimeout = 5000;
        beforeEach(function () {
            _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["SLog"].RequestLogLevel(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["SLogLevel"].Info);
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = _this.mDefaultWaitTimeout + 5000;
        });
        afterEach(function () {
            console.debug("Test shutting down ...");
            _this.ShutdownAll();
            originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
            jasmine.DEFAULT_TIMEOUT_INTERVAL = _this.mDefaultWaitTimeout + 5000;
        });
        //add all reusable tests here
        //TODO: check how to find the correct line where it failed
        it("TestEnvironmentAsync", function (done) {
            var value1 = false;
            var value2 = false;
            _this.then(function () {
                expect(value1).toBe(false);
                expect(value2).toBe(false);
                value1 = true;
            });
            _this.thenAsync(function (finished) {
                expect(value1).toBe(true);
                expect(value2).toBe(false);
                value2 = true;
                finished();
            });
            _this.then(function () {
                expect(value1).toBe(true);
                expect(value2).toBe(true);
                done();
            });
            _this.start();
        });
        it("Create", function () {
            var clt;
            clt = _this._CreateNetwork();
            expect(clt).not.toBe(null);
        });
        it("StartServer", function (done) {
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                srv.StartServer();
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).not.toBe(null);
                done();
            });
            _this.start();
        });
        it("StartServerNamed", function (done) {
            var name = "StartServerNamedTest";
            var evt;
            var srv1;
            var srv2;
            srv1 = _this._CreateNetwork();
            srv2 = _this._CreateNetwork();
            _this.thenAsync(function (finished) {
                srv1.StartServer(name);
                _this.waitForEvent(srv1, finished);
            });
            _this.then(function () {
                evt = srv1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).toBe(name);
            });
            _this.thenAsync(function (finished) {
                srv2.StartServer(name);
                _this.waitForEvent(srv2, finished);
            });
            _this.thenAsync(function (finished) {
                //expect the server start to fail because the address is in use
                evt = srv2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitFailed);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).toBe(name);
                //stop the other server to free the address
                srv1.StopServer();
                _this.waitForEvent(srv1, finished);
            });
            _this.thenAsync(function (finished) {
                //expect the server start to fail because the address is in use
                evt = srv1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerClosed);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                //stop the other server to free the address
                srv2.StartServer(name);
                _this.waitForEvent(srv2, finished);
            });
            _this.thenAsync(function (finished) {
                //expect the server start to fail because the address is in use
                evt = srv2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                done();
            });
            _this.start();
        });
        it("StopServer", function (done) {
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                srv.StopServer();
                _this.waitForEvent(srv, finished, 100);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("StopServer2", function (done) {
            var evt;
            var srv;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                srv.StartServer();
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerInitialized);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                expect(evt.Info).not.toBe(null);
            });
            _this.thenAsync(function (finished) {
                srv.StopServer();
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerClosed);
                expect(evt.ConnectionId.id).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                //enforce address in this to prepare having multiple addresses?
                //expect(evt.Info).not.toBe(null);
                done();
            });
            _this.start();
        });
        it("_CreateServerNetwork", function (done) {
            var srv;
            var address;
            _this.thenAsync(function (finished) {
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.then(function () {
                expect(srv).not.toBeNull();
                expect(address).not.toBeNull();
                done();
            });
            _this.start();
        });
        it("ConnectFail", function (done) {
            var evt;
            var clt;
            var cltId;
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                cltId = clt.Connect("invalid address");
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId.id);
                done();
            });
            _this.start();
        });
        it("ConnectTwo", function (done) {
            var srv;
            var address;
            var clt;
            var cltId;
            var evt;
            _this.thenAsync(function (finished) {
                srv = _this._CreateNetwork();
                _this._CreateServerNetwork(function (rsrv, raddress) {
                    srv = rsrv;
                    address = raddress;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt = _this._CreateNetwork();
                cltId = clt.Connect(address);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).toBe(cltId.id);
            });
            _this.thenAsync(function (finished) {
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].NewConnection);
                expect(evt.ConnectionId.id).not.toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID.id);
                done();
            });
            _this.start();
        });
        it("ConnectHelper", function (done) {
            var srv;
            var address;
            var clt;
            var cltToSrvId;
            var srvToCltId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    done();
                });
            });
            _this.start();
        });
        it("Peek", function (done) {
            var evt;
            var net = _this._CreateNetwork();
            var cltId1 = net.Connect("invalid address1");
            var cltId2 = net.Connect("invalid address2");
            var cltId3 = net.Connect("invalid address3");
            _this.thenAsync(function (finished) {
                _this.waitForEvent(net, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net.Peek();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId1.id);
                evt = net.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId1.id);
                _this.waitForEvent(net, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net.Peek();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId2.id);
                evt = net.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId2.id);
                _this.waitForEvent(net, finished);
            });
            _this.thenAsync(function (finished) {
                evt = net.Peek();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId3.id);
                evt = net.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ConnectionFailed);
                expect(evt.ConnectionId.id).toBe(cltId3.id);
                done();
            });
            _this.start();
        });
        it("Disconnect", function (done) {
            var evt;
            var clt = _this._CreateNetwork();
            _this.thenAsync(function (finished) {
                clt.Disconnect(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID);
                _this.waitForEvent(clt, finished, 100);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
                clt.Disconnect(new _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"](1234));
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("DisconnectClient", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.Disconnect(cltToSrvId);
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                done();
            });
            _this.start();
        });
        it("DisconnectServer", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                srv.Disconnect(srvToCltId);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                done();
            });
            _this.start();
        });
        it("DisconnectServerMulti", function (done) {
            var srv;
            var address;
            var srvToClt1Id;
            var srvToClt2Id;
            var clt1;
            var clt1ToSrvId;
            var clt2;
            var clt2ToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToClt1Id = rsrvToCltId;
                    clt1 = rclt;
                    clt1ToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt2 = _this._CreateNetwork();
                _this._Connect(srv, address, clt2, function (rsrvToCltId, rcltToSrvId) {
                    srvToClt2Id = rsrvToCltId;
                    clt2ToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                srv.Disconnect(srvToClt1Id);
                srv.Disconnect(srvToClt2Id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToClt1Id.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToClt2Id.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(clt1, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt1.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(clt1ToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(clt2, finished);
            });
            _this.then(function () {
                evt = clt2.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(clt2ToSrvId.id).toBe(evt.ConnectionId.id);
                done();
            });
            _this.start();
        });
        it("ShutdownEmpty", function (done) {
            var net;
            var evt;
            net = _this._CreateNetwork();
            _this.thenAsync(function (finished) {
                net.Shutdown();
                _this.waitForEvent(net, finished);
            });
            _this.then(function () {
                evt = net.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("ShutdownServer", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                srv.Shutdown();
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ServerClosed);
                expect(evt.ConnectionId).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID);
                _this.waitForEvent(srv, finished, 100);
            });
            _this.then(function () {
                //no further events are suppose to be triggered after shutdown
                evt = srv.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("ShutdownClient", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.Shutdown();
                _this.waitForEvent(clt, finished);
            });
            _this.thenAsync(function (finished) {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].Disconnected);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                _this.waitForEvent(srv, finished, 100);
            });
            _this.then(function () {
                evt = srv.Dequeue();
                expect(evt).toBeNull();
                done();
            });
            _this.start();
        });
        it("DisconnectInvalid", function (done) {
            var evt;
            var clt = _this._CreateNetwork();
            clt.Disconnect(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID);
            clt.Disconnect(new _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"](1234));
            _this.thenAsync(function (finished) {
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
            });
            _this.then(function () {
                done();
            });
            _this.start();
        });
        it("SendDataTolerateInvalidDestination", function (done) {
            var evt;
            var clt = _this._CreateNetwork();
            var testData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            _this.thenAsync(function (finished) {
                clt.SendData(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID, testData, true);
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
            });
            _this.thenAsync(function (finished) {
                clt.SendData(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["ConnectionId"].INVALID, testData, false);
                _this.waitForEvent(clt, finished, 100);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).toBeNull();
            });
            _this.then(function () {
                done();
            });
            _this.start();
        });
        it("SendDataReliable", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            var testMessage = "SendDataReliable_testmessage1234";
            var testMessageBytes = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetBytes(testMessage);
            var receivedTestMessage;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.SendData(cltToSrvId, testMessageBytes, true);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ReliableMessageReceived);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                srv.SendData(srvToCltId, testMessageBytes, true);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].ReliableMessageReceived);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                done();
            });
            _this.start();
        });
        it("SendDataUnreliable", function (done) {
            var srv;
            var address;
            var srvToCltId;
            var clt;
            var cltToSrvId;
            var evt;
            var testMessage = "SendDataUnreliable_testmessage1234";
            var testMessageBytes = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetBytes(testMessage);
            var receivedTestMessage;
            _this.thenAsync(function (finished) {
                _this._CreateServerClient(function (rsrv, raddress, rsrvToCltId, rclt, rcltToSrvId) {
                    srv = rsrv;
                    address = raddress;
                    srvToCltId = rsrvToCltId;
                    clt = rclt;
                    cltToSrvId = rcltToSrvId;
                    finished();
                });
            });
            _this.thenAsync(function (finished) {
                clt.SendData(cltToSrvId, testMessageBytes, false);
                _this.waitForEvent(srv, finished);
            });
            _this.thenAsync(function (finished) {
                evt = srv.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].UnreliableMessageReceived);
                expect(srvToCltId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                srv.SendData(srvToCltId, testMessageBytes, false);
                _this.waitForEvent(clt, finished);
            });
            _this.then(function () {
                evt = clt.Dequeue();
                expect(evt).not.toBeNull();
                expect(evt.Type).toBe(_awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["NetEventType"].UnreliableMessageReceived);
                expect(cltToSrvId.id).toBe(evt.ConnectionId.id);
                receivedTestMessage = _awrtc_network_index__WEBPACK_IMPORTED_MODULE_1__["Encoding"].UTF16.GetString(evt.MessageData);
                expect(receivedTestMessage).toBe(testMessage);
                done();
            });
            _this.start();
        });
    };
    return IBasicNetworkTest;
}(_BasicNetworkTestBase__WEBPACK_IMPORTED_MODULE_0__["BasicNetworkTestBase"]));



/***/ }),

/***/ "./src/test/test_entry.ts":
/*!********************************!*\
  !*** ./src/test/test_entry.ts ***!
  \********************************/
/*! exports provided: LocalNetworkTest, WebRtcNetworkTest, WebsocketTest, CallTestHelper, MediaNetworkTest, some_random_export_1, DeviceApiTest_export */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _LocalNetworkTest__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./LocalNetworkTest */ "./src/test/LocalNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "LocalNetworkTest", function() { return _LocalNetworkTest__WEBPACK_IMPORTED_MODULE_0__["LocalNetworkTest"]; });

/* harmony import */ var _WebRtcNetworkTest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./WebRtcNetworkTest */ "./src/test/WebRtcNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebRtcNetworkTest", function() { return _WebRtcNetworkTest__WEBPACK_IMPORTED_MODULE_1__["WebRtcNetworkTest"]; });

/* harmony import */ var _WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./WebsocketNetworkTest */ "./src/test/WebsocketNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "WebsocketTest", function() { return _WebsocketNetworkTest__WEBPACK_IMPORTED_MODULE_2__["WebsocketTest"]; });

/* harmony import */ var _CallTest__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CallTest */ "./src/test/CallTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "CallTestHelper", function() { return _CallTest__WEBPACK_IMPORTED_MODULE_3__["CallTestHelper"]; });

/* harmony import */ var _MediaNetworkTest__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./MediaNetworkTest */ "./src/test/MediaNetworkTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "MediaNetworkTest", function() { return _MediaNetworkTest__WEBPACK_IMPORTED_MODULE_4__["MediaNetworkTest"]; });

/* harmony import */ var _BrowserApiTest__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./BrowserApiTest */ "./src/test/BrowserApiTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "some_random_export_1", function() { return _BrowserApiTest__WEBPACK_IMPORTED_MODULE_5__["some_random_export_1"]; });

/* harmony import */ var _DeviceApiTest__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./DeviceApiTest */ "./src/test/DeviceApiTest.ts");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "DeviceApiTest_export", function() { return _DeviceApiTest__WEBPACK_IMPORTED_MODULE_6__["DeviceApiTest_export"]; });

/*
Copyright (c) 2019, because-why-not.com Limited
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

* Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer.

* Redistributions in binary form must reproduce the above copyright notice,
  this list of conditions and the following disclaimer in the documentation
  and/or other materials provided with the distribution.

* Neither the name of the copyright holder nor the names of its
  contributors may be used to endorse or promote products derived from
  this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/









/***/ })

/******/ });
//# sourceMappingURL=test.js.map