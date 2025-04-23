/* eslint-disable @typescript-eslint/no-this-alias */
import { Plugin } from 'obsidian';
import { unloadAllBanners } from './banner';
import BannerEvents from './BannerEvents';
import loadCommands from './commands';
import { loadExtensions } from './editing';
import { loadPostProcessor } from './reading';
import { loadSettings } from './settings';
import { unsetCssVars } from './settings/CssSettingsHandler';
import type { BannerSettings } from './settings/structure';

// ─── Banner 공간 고정 & 본문 오프셋 강제 적용 CSS ───
const bannerCss = `
:root {
  --banner-height: 400px;
}

.markdown-preview-view .banner-wrapper {
  position: relative;
  z-index: 1;
  max-height: var(--banner-height) !important;
  overflow: hidden !important;
}

.markdown-preview-view .banner-wrapper + .markdown-preview-section {
  margin-top: var(--banner-height) !important;
}

.view-mode-live-preview .banner-wrapper + .markdown-preview-view {
  padding-top: var(--banner-height) !important;
}

.workspace-leaf-content .banner-wrapper + .markdown-preview-section,
.workspace-leaf-content .banner-wrapper + .markdown-preview-view {
  margin-top: var(--banner-height) !important;
  padding-top: 0 !important;
}
`;

export let plug: BannersPlugin;

export default class BannersPlugin extends Plugin {
  settings!: BannerSettings;
  events!: BannerEvents;

  async onload() {
    plug = this;
    this.events = new BannerEvents();

    // 배너 고정 CSS 적용
    this.addStyle(bannerCss);

    await loadSettings();
    loadPostProcessor();
    loadExtensions();
    loadCommands();
    this.events.loadEvents();
  }

  async onunload() {
    unloadAllBanners();
    unsetCssVars();
    // 추가된 스타일은 자동으로 제거됩니다.
  }
}
